package dev.akarshmi.scholrforge.user.dto;

import dev.akarshmi.scholrforge.user.entity.Provider;
import dev.akarshmi.scholrforge.user.entity.Role;
import dev.akarshmi.scholrforge.user.entity.UserStatus;

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
