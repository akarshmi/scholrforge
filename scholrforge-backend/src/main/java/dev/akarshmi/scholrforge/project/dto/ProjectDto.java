package dev.akarshmi.scholrforge.project.dto;

import dev.akarshmi.scholrforge.project.entity.DifficultyLevel;
import dev.akarshmi.scholrforge.project.entity.ProjectStatus;
import dev.akarshmi.scholrforge.project.entity.ProjectType;

import java.time.Instant;
import java.util.UUID;

public record ProjectDto(
        UUID id,
//        UUID userId,
//        String username,

        String projectTitle,
        String description,
        String slug,

        ProjectType projectType,
        DifficultyLevel difficultyLevel,
        ProjectStatus status,

        String githubUrl,
        String demoVideoUrl,
        String downloadUrl,

        Long viewCount,
        Long downloadCount,
        Double avgRating,

        Instant createdAt,
        Instant updatedAt
) {}