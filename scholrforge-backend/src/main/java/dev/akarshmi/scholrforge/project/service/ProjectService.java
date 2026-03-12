package dev.akarshmi.scholrforge.project.service;

import dev.akarshmi.scholrforge.project.dto.CreateProjectRequest;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.entity.Project;

import java.util.List;

//@Service
public interface ProjectService {
    ProjectDto createProject(CreateProjectRequest project);
    ProjectDto updateProject(Project project);
    void deleteProject(Project project);
    List<ProjectDto> getProjectsOf(String username);
    List<ProjectDto> getMyProjects();


}
