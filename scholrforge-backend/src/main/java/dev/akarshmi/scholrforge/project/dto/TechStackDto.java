package dev.akarshmi.scholrforge.project.dto;

import java.util.UUID;

public record TechStackDto(
        UUID id,
        String name,
        String iconUrl,
        String category
) {}