package dev.akarshmi.scholrforge.project.service;

import dev.akarshmi.scholrforge.auth.security.SecurityUser;
import dev.akarshmi.scholrforge.common.constants.ProjectConstants;
import dev.akarshmi.scholrforge.common.helper.ApiResponse;
import dev.akarshmi.scholrforge.common.helper.ProjectMapper;
import dev.akarshmi.scholrforge.common.helper.SlugGenerator;
import dev.akarshmi.scholrforge.project.dto.CreateProjectRequest;
import dev.akarshmi.scholrforge.project.dto.ProjectResponseDto;
import dev.akarshmi.scholrforge.project.dto.UpdateProjectRequest;
import dev.akarshmi.scholrforge.project.entity.*;
import dev.akarshmi.scholrforge.project.exceptions.ProjectDoesNotExistsException;
import dev.akarshmi.scholrforge.project.repository.ProjectMediaRepository;
import dev.akarshmi.scholrforge.project.repository.ProjectRepository;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.repository.TagRepository;
import dev.akarshmi.scholrforge.project.repository.TechStackRepository;
import dev.akarshmi.scholrforge.user.entity.User;
import dev.akarshmi.scholrforge.user.repository.UserRepository;
import dev.akarshmi.scholrforge.user.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.*;
import java.util.function.Consumer;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final UserService userService;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMediaRepository projectMediaRepository;
    private final TechStackRepository techStackRepository;
    private final TagRepository tagRepository;
    private final SlugGenerator slugGenerator;
    private final ProjectMapper projectMapper;



    @Override
    @Transactional
    public ProjectResponseDto createProject(CreateProjectRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UUID userId = ((SecurityUser) auth.getPrincipal()).getUserId();

        String slug = slugGenerator.generateUniqueSlug(
                request.projectTitle(),
                projectRepository::existsBySlug
        );

        // 1. Handle file upload — file takes priority over URL if both provided
        String downloadUrl = request.downloadUrl();
        if (request.projectFile() != null && !request.projectFile().isEmpty()) {
            downloadUrl = storageService.uploadProjectFile(
                    request.projectFile(), userId
            );
        }

        // 2. Resolve tags
        Set<Tag> tags = resolveTags(request.tagIds(), request.newTagNames());

        // 3. Resolve tech stacks
        Set<TechStack> techStacks = resolveTechStacks(
                request.techStackIds(), request.newTechStackNames()
        );

        // 4. Save project
        Project savedProject = projectRepository.save(
                Project.builder()
                        .userId(userId)
                        .projectTitle(request.projectTitle())
                        .description(request.description())
                        .projectType(request.projectType())
                        .difficultyLevel(request.difficultyLevel())
                        .githubUrl(request.githubUrl())
                        .downloadUrl(downloadUrl)
                        .demoVideoUrl(request.demoVideoUrl())
                        .slug(slug)
                        .status(ProjectStatus.UNDER_REVIEW)
                        .tags(tags)
                        .techStack(techStacks)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()
        );

        // 5. Handle optional media uploads
        if (request.mediaFiles() != null && !request.mediaFiles().isEmpty()) {
            List<ProjectMedia> mediaList = new ArrayList<>();
            for (int i = 0; i < request.mediaFiles().size(); i++) {
                MultipartFile file = request.mediaFiles().get(i);
                if (file != null && !file.isEmpty()) {
                    String url = storageService.uploadMedia(file, savedProject.getId());
                    mediaList.add(ProjectMedia.builder()
                            .project(savedProject)
                            .url(url)
                            .mediaType(resolveMediaType(file.getContentType()))
                            .displayOrder(i)
                            .altText(file.getOriginalFilename())
                            .build());
                }
            }
            projectMediaRepository.saveAll(mediaList);
            savedProject.setMedia(mediaList);
        }
        return projectMapper.toResponseDto(savedProject);
//        return projectMapper.toResponseDto(savedProject);
    }


    @Override
    public ProjectResponseDto updateProject(UpdateProjectRequest request) {
        Project project = projectRepository.findById(UUID.fromString(request.uuid()))
                .orElseThrow(()->new ProjectDoesNotExistsException(ProjectConstants.PROJECT_NOT_FOUND));

        updateIfPresent(request.projectTitle(), project::setProjectTitle);
        updateIfPresent(request.description(), project::setDescription);
//        updateIfPresent(request.projectType(), project::setProjectType);
//        updateIfPresent(request.difficultyLevel(), project::setDifficultyLevel);
        updateIfPresent(request.githubUrl(), project::setGithubUrl);
        updateIfPresent(request.demoVideoUrl(), project::setDemoVideoUrl);
        updateIfPresent(request.downloadUrl(), project::setDownloadUrl);

        return projectMapper.toResponseDto(projectRepository.save(project));
    }

    @Override
    public ApiResponse deleteProject(UUID uuid) {
        Project project = projectRepository.findById(uuid).orElseThrow(() -> new ProjectDoesNotExistsException(ProjectConstants.PROJECT_NOT_FOUND));
        projectRepository.delete(project);
        return ApiResponse.of(HttpStatus.ACCEPTED.value(),ProjectConstants.PROJECT_DELETED_SUCCESS);
    }


    private void updateIfPresent(String value, Consumer<String> setter) {
        if (value != null && !value.isBlank()) {
            setter.accept(value);
        }
    }

    private Set<Tag> resolveTags(Set<UUID> tagIds, Set<String> newTagNames) {
        Set<Tag> tags = new HashSet<>();

        if (tagIds != null && !tagIds.isEmpty()) {
            tags.addAll(tagRepository.findAllById(tagIds));
        }

        if (newTagNames != null && !newTagNames.isEmpty()) {
            newTagNames.stream()
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .filter(name -> !name.isBlank())
                    .forEach(name -> {
                        Tag tag = tagRepository.findByNameIgnoreCase(name)
                                .orElseGet(() -> tagRepository.save(
                                        Tag.builder().name(name).build()
                                ));
                        tags.add(tag);
                    });
        }

        return tags;
    }

    private Set<TechStack> resolveTechStacks(Set<UUID> ids, Set<String> newNames) {
        Set<TechStack> stacks = new HashSet<>();

        if (ids != null && !ids.isEmpty()) {
            stacks.addAll(techStackRepository.findAllById(ids));
        }

        if (newNames != null && !newNames.isEmpty()) {
            newNames.stream()
                    .map(String::trim)
                    .filter(name -> !name.isBlank())
                    .forEach(name -> {
                        TechStack stack = techStackRepository.findByNameIgnoreCase(name)
                                .orElseGet(() -> techStackRepository.save(
                                        TechStack.builder().name(name).build()
                                ));
                        stacks.add(stack);
                    });
        }

        return stacks;
    }

    private MediaType resolveMediaType(String contentType) {
        if (contentType == null) return MediaType.IMAGE;
        if (contentType.startsWith("video/")) return MediaType.VIDEO;
        if (contentType.equals("image/gif")) return MediaType.GIF;
        return MediaType.IMAGE;
    }


    @Override
    public List<ProjectDto> getProjectsOf(String username) {
        Pageable pageable = PageRequest.of(
                0,
                10,
                Sort.by("projectTitle").ascending()
        );

        Page<Project> projects = projectRepository.findAll(pageable);
        return projectMapper.toProjectDtos(projects.getContent());
    }

    @Override
    public List<ProjectDto> getMyProjects() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName());
        Pageable pageable = PageRequest.of(0,10);
        Page<Project> projects = projectRepository.findByUserId(user.getUserId(), pageable);
        return projectMapper.toProjectDtos(projects.getContent());
    }

    @Override
    public List<ProjectDto> getAllProjectsByCreatedDate(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectMapper.toProjectDtos(projectRepository.findAllByOrderByCreatedAtDesc(pageable));
    }

    @Override
    public ProjectDto getById(UUID uuid) {
        return projectMapper.toProjectDto(projectRepository.findById(uuid).orElseThrow(() -> new ProjectDoesNotExistsException(ProjectConstants.PROJECT_NOT_FOUND)));
    }

    @Override
    public List<ProjectDto> search(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Project> project = projectRepository.findByProjectTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageable);
        return projectMapper.toProjectDtos(project);
    }
}
