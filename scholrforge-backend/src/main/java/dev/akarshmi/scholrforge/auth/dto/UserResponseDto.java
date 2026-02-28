package dev.akarshmi.scholrforge.auth.dto;

import dev.akarshmi.scholrforge.auth.entity.Provider;
import dev.akarshmi.scholrforge.auth.entity.Role;
import dev.akarshmi.scholrforge.auth.entity.UserStatus;

import java.time.Instant;

public record UserResponseDto (

        String username,
        String name,
        String email,
        String phone,
        String avatarUrl,
        Provider provider,
        Instant createdAt,
        Instant updatedAt,
        boolean emailVerified,
        Role role,
        UserStatus status
) {
}
