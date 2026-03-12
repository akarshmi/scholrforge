package dev.akarshmi.scholrforge.project.service;

import dev.akarshmi.scholrforge.common.helper.ProjectMapper;
import dev.akarshmi.scholrforge.common.helper.SlugGenerator;
import dev.akarshmi.scholrforge.common.helper.UserMapperInterface;
import dev.akarshmi.scholrforge.project.dto.CreateProjectRequest;
import dev.akarshmi.scholrforge.project.entity.Project;
import dev.akarshmi.scholrforge.project.entity.ProjectStatus;
import dev.akarshmi.scholrforge.project.repository.ProjectRepository;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.user.entity.User;
import dev.akarshmi.scholrforge.user.repository.UserRepository;
import dev.akarshmi.scholrforge.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;

    private final SlugGenerator slugGenerator;
    @Override
    public ProjectDto createProject(CreateProjectRequest project) {
        //validation of data which came from the user in the form of DTO
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        System.err.println(auth.getPrincipal()+" User " +auth.getName());
        User user = userRepository.findByEmail(auth.getName());

        String slug = slugGenerator.generateUniqueSlug(
                project.projectTitle(),
                projectRepository::existsBySlug
        );

        //create the project
        Project savedProject = projectRepository.save(
                Project.builder()
                        .user(user)
                        .projectTitle(project.projectTitle())
                        .description(project.description())
                        .projectType(project.projectType())
                        .demoVideoUrl(project.demoVideoUrl())
                        .downloadUrl(project.downloadUrl())
                        .githubUrl(project.githubUrl())
                        .downloadCount(0L)
                        .viewCount(0L)
                        .status(ProjectStatus.PUBLISHED)
                        .slug(slug)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build()
        );

        return projectMapper.toProjectDto(savedProject);
    }

    @Override
    public ProjectDto updateProject(Project project) {
        return null;
    }

    @Override
    public void deleteProject(Project project) {

    }

    @Override
    public List<ProjectDto> getProjectsOf(String username) {
        User user = userService.findUserByUsername(username);
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
        Page<Project> projects = projectRepository.findByUser(user, pageable);
        return projectMapper.toProjectDtos(projects.getContent());
    }

}
