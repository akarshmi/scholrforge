package dev.akarshmi.scholrforge.auth.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public record UserUpdateDto (
        @Size(max = 100) String name,
        @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$") String phone,
        String avatarUrl
){
}
