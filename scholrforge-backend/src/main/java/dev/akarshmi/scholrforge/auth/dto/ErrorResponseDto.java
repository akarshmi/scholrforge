package dev.akarshmi.scholrforge.auth.dto;

import java.time.LocalDateTime;

public record ErrorResponseDto(
        String message,
        int status,
        String error,
        String path,
        LocalDateTime timestamp
) {}
