package dev.akarshmi.scholrforge.project.dto;

import dev.akarshmi.scholrforge.common.constants.ProjectConstants;
import dev.akarshmi.scholrforge.project.entity.DifficultyLevel;
import dev.akarshmi.scholrforge.project.entity.ProjectType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.UUID;

public record UpdateProjectRequest(

        @NotBlank(message = ProjectConstants.PROJECT_NOT_FOUND)
        String uuid,


        @NotBlank(message = ProjectConstants.PROJECT_TITLE_NOT_BLANK)
        @Size(min = 3, max = 150, message = ProjectConstants.PROJECT_TITLE_SIZE_AND_PATTERN)
        String projectTitle,

        @NotBlank(message = ProjectConstants.PROJECT_DESCRIPTION_NOT_BLANK)
        @Size(min = 10, max = 2000, message = ProjectConstants.PROJECT_DESCRIPTION_NOT_BLANK)
        String description,

        @NotNull(message = ProjectConstants.PROJECT_TYPE_REQUIRED)
        ProjectType projectType,

        @NotNull(message = ProjectConstants.PROJECT_DIFFICULTY_LEVEL_REQUIRED)
        DifficultyLevel difficultyLevel,

        @Pattern(
                regexp = "^(https?:\\/\\/)?(www\\.)?github\\.com\\/.+",
                message = ProjectConstants.PROJECT_REPOSITORY_URL_INVALID
        )
        String githubUrl,

        @Pattern(
                regexp = "^(https?:\\/\\/).+",
                message = ProjectConstants.PROJECT_DEMO_URL_INVALID
        )
        String demoVideoUrl,

        @Size(max = 255, message = ProjectConstants.PROJECT_DOWNLOAD_URL_SIZE_EXCEEDED)
        String fileName



) {
}
