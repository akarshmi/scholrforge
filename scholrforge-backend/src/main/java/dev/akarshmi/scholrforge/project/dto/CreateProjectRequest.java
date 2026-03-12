package dev.akarshmi.scholrforge.project.dto;

import dev.akarshmi.scholrforge.project.entity.DifficultyLevel;
import dev.akarshmi.scholrforge.project.entity.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateProjectRequest(
        @NotBlank(message = "Project title cannot be blank")
        @Size(min = 3, max = 150, message = "Project title must be between 3 and 150 characters")
        String projectTitle,

        @NotBlank(message = "Description cannot be blank")
        @Size(min = 10, max = 2000, message = "Description must be between 10 and 2000 characters")
        String description,

        @NotNull(message = "Project type is required")
        ProjectType projectType,

        @NotNull(message = "Difficulty level is required")
        DifficultyLevel difficultyLevel,

        @Pattern(
                regexp = "^(https?:\\/\\/)?(www\\.)?github\\.com\\/.+",
                message = "Invalid GitHub repository URL"
        )
        String githubUrl,

        @Pattern(
                regexp = "^(https?:\\/\\/).+",
                message = "Invalid demo video URL"
        )
        String demoVideoUrl,

        @Size(max = 255, message = "File path must not exceed 255 characters")
        String downloadUrl


) {
}
