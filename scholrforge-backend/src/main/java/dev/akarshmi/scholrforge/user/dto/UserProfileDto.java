package dev.akarshmi.scholrforge.user.dto;

import dev.akarshmi.scholrforge.user.entity.Provider;
import dev.akarshmi.scholrforge.user.entity.Role;
import dev.akarshmi.scholrforge.user.entity.UserStatus;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {
    private String username;
    private String name;
    private String email;
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
