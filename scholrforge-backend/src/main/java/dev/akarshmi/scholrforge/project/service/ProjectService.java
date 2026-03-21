package dev.akarshmi.scholrforge.project.service;

import dev.akarshmi.scholrforge.common.helper.ApiResponse;
import dev.akarshmi.scholrforge.project.dto.CreateProjectRequest;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.dto.ProjectResponseDto;
import dev.akarshmi.scholrforge.project.dto.UpdateProjectRequest;
import dev.akarshmi.scholrforge.project.entity.Project;
import dev.akarshmi.scholrforge.project.entity.ProjectStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

//@Service
public interface ProjectService {
    ProjectResponseDto createProject(CreateProjectRequest project, Authentication authentication);
    ProjectResponseDto updateProject(UpdateProjectRequest request);
    ApiResponse deleteProject(UUID uuid);
    List<ProjectDto> getProjectsOf(String username);
    List<ProjectResponseDto> getMyProjects(UUID userId, int page, int size, String sort);
    List<ProjectResponseDto> getAllProjectsByCreatedDate(int page, int size);
    ProjectDto getById(UUID uuid);
    List<ProjectResponseDto> search(String keyword,int page,int size);
    ProjectResponseDto findBySlug(String slug);
    List<ProjectResponseDto> getApprovedByUsername(String username,int page,int size);
    List<ProjectResponseDto> getAllProjectByStatus();
    ProjectResponseDto uploadProjectFile(UUID id, MultipartFile zipFile,Authentication authentication);

}
