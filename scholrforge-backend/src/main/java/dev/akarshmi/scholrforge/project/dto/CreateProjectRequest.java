package dev.akarshmi.scholrforge.project.dto;

import dev.akarshmi.scholrforge.common.constants.ProjectConstants;
import dev.akarshmi.scholrforge.project.entity.DifficultyLevel;
import dev.akarshmi.scholrforge.project.entity.ProjectType;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.UUID;
public record CreateProjectRequest(
        String projectTitle,
        String description,
        ProjectType projectType,
        DifficultyLevel difficultyLevel,
        String githubUrl,
        String demoVideoUrl,
        Set<UUID> tagIds,
        Set<String> newTagNames,
        Set<UUID> techStackIds,
        Set<String> newTechStackNames
) {}