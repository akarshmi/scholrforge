package dev.akarshmi.scholrforge.project.service;

import dev.akarshmi.scholrforge.auth.exception.validation.UserDoesNotExistsException;
import dev.akarshmi.scholrforge.auth.security.SecurityUser;
import dev.akarshmi.scholrforge.common.constants.ProjectConstants;
import dev.akarshmi.scholrforge.common.helper.ApiResponse;
import dev.akarshmi.scholrforge.common.helper.ProjectMapper;
import dev.akarshmi.scholrforge.common.helper.SlugGenerator;
import dev.akarshmi.scholrforge.common.helper.UserMapperInterface;
import dev.akarshmi.scholrforge.project.dto.*;
import dev.akarshmi.scholrforge.project.entity.*;
import dev.akarshmi.scholrforge.project.exceptions.ProjectDoesNotExistsException;
import dev.akarshmi.scholrforge.project.repository.ProjectRepository;
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
import org.springframework.web.servlet.View;

import java.time.Instant;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final UserService userService;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TechStackRepository techStackRepository;
    private final TagRepository tagRepository;
    private final SlugGenerator slugGenerator;
    private final ProjectMapper projectMapper;


    @Override
    @Transactional
    public ProjectResponseDto createProject(CreateProjectRequest request, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof SecurityUser user)) {
            throw new RuntimeException("Invalid authentication");
        }
        UUID userId = user.getUserId();

        String slug = slugGenerator.generateUniqueSlug(
                request.projectTitle(),
                projectRepository::existsBySlug
        );
        //2. Mapping the tags with tags and techstack with techstack
        Set<Tag> tags = new HashSet<>();

        // Existing tags by ID
        if (request.tagIds() != null && !request.tagIds().isEmpty()) {
            Set<Tag> existing = tagRepository.findAllByIdIn(request.tagIds());
            tags.addAll(existing);
        }

        // New tags — find or create to avoid duplicates
        if (request.newTagNames() != null && !request.newTagNames().isEmpty()) {
            for (String name : request.newTagNames()) {
                Tag tag = tagRepository.findByNameIgnoreCase(name.trim())
                        .orElseGet(() -> tagRepository.save(
                                Tag.builder().name(name.trim()).build()
                        ));
                tags.add(tag);
            }
        }


        Set<TechStack> techStacks = new HashSet<>();

        // Existing tech stacks by ID
        if (request.techStackIds() != null && !request.techStackIds().isEmpty()) {
            Set<TechStack> existing = techStackRepository.findAllByIdIn(request.techStackIds());
            techStacks.addAll(existing);
        }

        // New tech stacks — find or create to avoid duplicates
        if (request.newTechStackNames() != null && !request.newTechStackNames().isEmpty()) {
            for (String name : request.newTechStackNames()) {
                TechStack tech = techStackRepository.findByNameIgnoreCase(name.trim())
                        .orElseGet(() -> techStackRepository.save(
                                TechStack.builder().name(name.trim()).build()
                        ));
                techStacks.add(tech);
            }
        }



        Project project = Project.builder()
                .userId(userId)
                .slug(slug)
                .projectTitle(request.projectTitle())
                .description(request.description())
                .projectType(request.projectType())
                .difficultyLevel(request.difficultyLevel())
                .githubUrl(request.githubUrl())
                .demoVideoUrl(request.demoVideoUrl())
//                .fileName(savedFilePath)
                .downloadCount(0L)
                .avgRating(0D)
                .status(ProjectStatus.UNDER_REVIEW)
                .tags(tags)
                .techStack(techStacks)
                .build();

        Project saved = projectRepository.save(project);
      return projectMapper.toDto(saved);
    }


    @Override
    @Transactional
    public ProjectResponseDto updateProject(UpdateProjectRequest request) {
        Project project = projectRepository.findById(UUID.fromString(request.uuid()))
                .orElseThrow(()->new ProjectDoesNotExistsException(ProjectConstants.PROJECT_NOT_FOUND));

        updateIfPresent(request.projectTitle(), project::setProjectTitle);
        updateIfPresent(request.description(), project::setDescription);
//        updateIfPresent(request.projectType(), project::setProjectType);
//        updateIfPresent(request.difficultyLevel(), project::setDifficultyLevel);
        updateIfPresent(request.githubUrl(), project::setGithubUrl);
        updateIfPresent(request.demoVideoUrl(), project::setDemoVideoUrl);
        updateIfPresent(request.fileName(), project::setFileName);

        return projectMapper.toDto(projectRepository.save(project));
    }

    @Override
    @Transactional
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
    public List<ProjectResponseDto> getMyProjects(UUID userId, int page, int size, String sort) {
        String[] parts = sort.split(",");
        Sort s = Sort.by(Sort.Direction.fromString(parts[1]), parts[0]);
        Pageable pageable = PageRequest.of(page, size, s);
        return projectMapper.toResponseDtoList(
                projectRepository.findByUserId(userId, pageable)
        );
    }

    @Override
    public List<ProjectResponseDto> getAllProjectsByCreatedDate(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return projectMapper.toResponseDtoList(projectRepository.findAllByOrderByCreatedAtDesc(pageable));
    }

    @Override
    public ProjectDto getById(UUID uuid) {
        return projectMapper.toProjectDto(projectRepository.findById(uuid).orElseThrow(() -> new ProjectDoesNotExistsException(ProjectConstants.PROJECT_NOT_FOUND)));
    }

    @Override
    public List<ProjectResponseDto> search(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<Project> project = projectRepository.findByProjectTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageable);
        return projectMapper.toResponseDtoList(project);
    }

    @Override
    public ProjectResponseDto findBySlug(String slug) {
        Project project = projectRepository.findBySlug(slug);
        // Fetch user from user module
//        userService.getUserById(project.getUserId().toString());
        User user = userRepository.findById(project.getUserId())
                .orElse(null);

        Author author = user != null
                ? new Author(
                user.getUserId().toString(),
                user.getUsername(),
                user.getName(),
                user.getAvatarUrl()
        )
                : null;

        return projectMapper.toDto(project, author);
    }

    @Override
    public List<ProjectResponseDto> getApprovedByUsername(String username, int page, int size) {
        User user = userRepository.findByUsername(username);
        Pageable pageable = PageRequest.of(page, size);
        List<Project> projects = projectRepository.findByUserIdAndStatus(user.getUserId(), ProjectStatus.PUBLISHED, pageable);
        return projectMapper.toResponseDtoList(projects);
    }

    @Override
    public List<ProjectResponseDto> getAllProjectByStatus() {
        return projectMapper.toResponseDtoList(projectRepository.findAllByStatusIn((
                List.of(ProjectStatus.PUBLISHED, ProjectStatus.UNDER_REVIEW)
        )));

    }

    @Override
    @Transactional
    public ProjectResponseDto uploadProjectFile(UUID projectId, MultipartFile zipFile, Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof SecurityUser user)) {
            throw new RuntimeException("Invalid authentication");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found: " + projectId));

        if (!project.getUserId().equals(user.getUserId())) {
            throw new RuntimeException("You do not have permission to upload files for this project");
        }
        if (zipFile == null || zipFile.isEmpty()) {
            throw new RuntimeException("ZIP file must not be empty");
        }

        String originalName = zipFile.getOriginalFilename();
        if (originalName == null || !originalName.toLowerCase().endsWith(".zip")) {
            throw new RuntimeException("Only .zip files are accepted");
        }
        if (project.getFileName() != null) {
            storageService.deleteFile(project.getFileName());
        }
        String savedFileName = storageService.uploadProjectFile(zipFile);
        project.setFileName(savedFileName);
        Project saved = projectRepository.save(project);
        return projectMapper.toDto(saved);
    }
}
