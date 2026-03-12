package dev.akarshmi.scholrforge.user.dto;


import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record UserUpdateDto(
        @Size(min = 3, max = 30, message = AuthConstants.USERNAME_SIZE)
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = AuthConstants.USERNAME_PATTERN)
        String username,

        @Size(max = 100)
        String name,

        @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = AuthConstants.PHONE_PATTERN)
        String phone,

        @URL(message = "Invalid avatar URL")
        String avatarUrl
) {}