package dev.akarshmi.scholrforge.project.service;

import dev.akarshmi.scholrforge.project.dto.CreateProjectRequest;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.dto.ProjectResponseDto;
import dev.akarshmi.scholrforge.project.dto.UpdateProjectRequest;
import dev.akarshmi.scholrforge.project.entity.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.UUID;

//@Service
public interface ProjectService {
    ProjectResponseDto createProject(CreateProjectRequest project);
    ProjectResponseDto updateProject(UpdateProjectRequest request);
    void deleteProject(UUID uuid);
    List<ProjectDto> getProjectsOf(String username);
    List<ProjectDto> getMyProjects();
    List<ProjectDto> getAllProjectsByCreatedDate();
    ProjectDto getById(UUID uuid);


}
