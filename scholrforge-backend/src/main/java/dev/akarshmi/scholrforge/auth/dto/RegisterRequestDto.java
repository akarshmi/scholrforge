package dev.akarshmi.scholrforge.auth.dto;

import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.user.entity.Provider;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public record RegisterRequestDto(

        @NotBlank(message = AuthConstants.NAME_NOT_BLANK)
        @Size(max = 100, message = AuthConstants.NAME_SIZE)
        String name,

        @NotBlank(message = AuthConstants.USERNAME_NOT_BLANK)
        @Pattern(regexp = "^[a-zA-Z0-9_]+$",message = AuthConstants.USERNAME_PATTERN)
        @Size(min = 3, max = 50,message = AuthConstants.USERNAME_SIZE)
        String username,

        @NotBlank(message = AuthConstants.EMAIL_NOT_BLANK)
        @Email(message = AuthConstants.EMAIL_INVALID)
        String email,

        String password,
        String avtarUrl,
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = AuthConstants.PHONE_PATTERN)
        String phone,

        Provider provider
) {
}
