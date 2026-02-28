package dev.akarshmi.scholrforge.auth.dto;

import dev.akarshmi.scholrforge.auth.entity.Provider;
import dev.akarshmi.scholrforge.auth.entity.Role;
import dev.akarshmi.scholrforge.auth.entity.UserStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private String username;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String avatarUrl;
    private Provider provider;
    private String providerId;
    private Instant createdAt;
    private Instant updatedAt;
    private boolean emailVerified;
    private Role role;
    private UserStatus status;
}
