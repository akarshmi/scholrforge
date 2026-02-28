package dev.akarshmi.scholrforge.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequestDto (
//        String username,
        @NotBlank
        @Email
        String email,
        @NotBlank
        String password
){
}
