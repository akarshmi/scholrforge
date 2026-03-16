package dev.akarshmi.scholrforge.project.controller;

import dev.akarshmi.scholrforge.common.constants.ProjectConstants;
import dev.akarshmi.scholrforge.common.helper.ApiResponse;
import dev.akarshmi.scholrforge.project.dto.CreateProjectRequest;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.project.dto.ProjectResponseDto;
import dev.akarshmi.scholrforge.project.dto.UpdateProjectRequest;
import dev.akarshmi.scholrforge.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ProjectConstants.PROJECT_BASE_URL)
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;


    //    POST   /api/projects               # Create new project
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponseDto createProject(@RequestBody CreateProjectRequest request) {
       return projectService.createProject(request);
    }


////    GET    /api/projects               # List all projects
//    @GetMapping
//    public ResponseEntity<List<ProjectDto>> getAllProjects() {
//        return ResponseEntity.ok(projectService.getAllProjectsByCreatedDate());
//    }

//    GET    /api/projects               # List all projects
    @GetMapping
    public ResponseEntity<List<ProjectDto>> searchProject(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (keyword==null || keyword.isEmpty()) {
            return ResponseEntity.ok(projectService.getAllProjectsByCreatedDate(page, size));
        }
        return ResponseEntity.ok(projectService.search(keyword,page,size));
    }


//    GET    /api/projects/{id}          # Get project details
    @GetMapping("/{id}")
    ResponseEntity<ProjectDto> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getById(UUID.fromString(id)));
    }


//    PUT    /api/projects/{id}          # Update project
    @PutMapping()
    public ResponseEntity<ProjectResponseDto> updateProject(UpdateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(request));
    }

//    DELETE /api/projects/{id}          # Delete project
    @DeleteMapping("/{id}")
    public ApiResponse deleteProject(@PathVariable String id) {
        return projectService.deleteProject(UUID.fromString(id));
    }


//    GET    /api/projects/trending      # Get trending projects
//    POST   /api/projects/{id}/download # Track download

}
