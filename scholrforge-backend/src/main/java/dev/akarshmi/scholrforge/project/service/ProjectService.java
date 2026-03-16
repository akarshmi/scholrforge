package dev.akarshmi.scholrforge.project.service;

import dev.akarshmi.scholrforge.common.helper.ApiResponse;
import dev.akarshmi.scholrforge.project.dto.CreateProjectRequest;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.dto.ProjectResponseDto;
import dev.akarshmi.scholrforge.project.dto.UpdateProjectRequest;
import dev.akarshmi.scholrforge.project.entity.Project;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

//@Service
public interface ProjectService {
    ProjectResponseDto createProject(CreateProjectRequest project);
    ProjectResponseDto updateProject(UpdateProjectRequest request);
    ApiResponse deleteProject(UUID uuid);
    List<ProjectDto> getProjectsOf(String username);
    List<ProjectDto> getMyProjects();
    List<ProjectDto> getAllProjectsByCreatedDate(int page, int size);
    ProjectDto getById(UUID uuid);
    List<ProjectDto> search(String keyword,int page,int size);


}
