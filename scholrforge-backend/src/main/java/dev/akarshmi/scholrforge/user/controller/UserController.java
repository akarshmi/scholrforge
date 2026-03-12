package dev.akarshmi.scholrforge.user.controller;

import dev.akarshmi.scholrforge.common.constants.UserConstants;
import dev.akarshmi.scholrforge.project.service.ProjectService;
import dev.akarshmi.scholrforge.project.dto.ProjectDto;
import dev.akarshmi.scholrforge.user.dto.UserResponseDto;
import dev.akarshmi.scholrforge.user.dto.UserUpdateDto;
import dev.akarshmi.scholrforge.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(UserConstants.USER_BASE_URL)
@RequiredArgsConstructor
public class UserController {

//    GET    /api/users/me/bookmarks     # Get bookmarks
//    POST   /api/users/{id}/follow      # Follow user

    private final UserService userService;
    private final ProjectService projectService;

//    GET    /api/users/{username}       # Get user profile
    @GetMapping("/{username}")
    public ResponseEntity<Optional<UserResponseDto>> getUser(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

//    GET    /api/users/me/projects      # Get user's projects
    @GetMapping("/me/projects")
    public ResponseEntity<List<ProjectDto>> myProjects() {
        return ResponseEntity.ok(projectService.getMyProjects());
    }

//    PUT    /api/users/me               # Update own profile
    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateUser(@RequestBody UserUpdateDto userUpdateDto, Authentication authentication) {
        String uid = (String) authentication.getPrincipal(); // UUID returns from the principle JWT
        return ResponseEntity.ok(
                userService.updateUser(uid, userUpdateDto)
        );
    }

}
