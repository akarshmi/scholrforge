package dev.akarshmi.scholrforge.project.controller;

import dev.akarshmi.scholrforge.common.constants.ProjectConstants;
import dev.akarshmi.scholrforge.project.dto.CreateProjectRequest;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ProjectConstants.PROJECT_BASE_URL)
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;


//    POST   /api/projects               # Create new project
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDto createProject(@RequestBody CreateProjectRequest request) {
       return projectService.createProject(request);
    }


}
