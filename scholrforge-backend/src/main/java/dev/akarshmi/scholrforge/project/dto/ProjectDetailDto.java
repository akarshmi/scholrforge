package dev.akarshmi.scholrforge.project.dto;

import dev.akarshmi.scholrforge.project.entity.DifficultyLevel;
import dev.akarshmi.scholrforge.project.entity.ProjectStatus;
import dev.akarshmi.scholrforge.project.entity.ProjectType;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public record ProjectDetailDto (
        UUID id,
        UUID userId,
        String projectTitle,
        String slug,
        String description,
        ProjectType projectType,
        DifficultyLevel difficultyLevel,
        ProjectStatus status,
        String githubUrl,
        String downloadUrl,
        String demoVideoUrl,
        Long viewCount,
        Long downloadCount,
        Double avgRating,
        Set<TagDto> tags,
        Set<TechStackDto> techStack,
        Instant createdAt,
        Instant updatedAt
){
}

