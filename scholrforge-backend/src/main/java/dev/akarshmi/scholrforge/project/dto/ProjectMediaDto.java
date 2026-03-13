package dev.akarshmi.scholrforge.project.dto;

import dev.akarshmi.scholrforge.project.entity.MediaType;
import java.util.UUID;

public record ProjectMediaDto(
        UUID id,
        String url,
        MediaType mediaType,
        Integer displayOrder,
        String altText
) {}