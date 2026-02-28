package dev.akarshmi.scholrforge.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString(exclude = "passwordHash")
@Table(name = "users")
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(unique = true, nullable = false, updatable = false, length = 36)
    private UUID userId;

    @Column(unique = true, nullable = false,name = "username", length = 50)
    private String username;

    @Column(nullable = false,length = 100)
    private String name;

    private String passwordHash;

    @Column(nullable = false,length = 100,unique = true)
    private String email;

    @Column(name = "phone")
    private String phone;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    private Provider provider = Provider.LOCAL;

    private String providerId;

    @Column(name = "createdAt")
    private Instant createdAt= Instant.now();

    @Column(name = "updatedAt")
    private Instant updatedAt= Instant.now();

    @Column(name = "emailVerified")
    private boolean emailVerified = false;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role =  Role.USER;

    @Column(name =  "status")
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;



}
