package dev.akarshmi.scholrforge.auth.entity;

import dev.akarshmi.scholrforge.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "refreshTokens",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_refresh_token_jti", columnNames = "jti")
        },
        indexes = {
                @Index(name = "idx_refresh_token_jti", columnList = "jti"),
                @Index(name = "idx_refresh_token_user_id", columnList = "userId"),
                @Index(name = "idx_refresh_token_expires_at", columnList = "expiresAt"),
                @Index(name = "idx_refresh_token_revoked", columnList = "revoked"),
                @Index(name = "idx_refresh_token_user_revoked", columnList = "userId, revoked"),
                @Index(name = "idx_refresh_token_expires_revoked", columnList = "expiresAt, revoked")
        })
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "jti", nullable = false, updatable = false, length = 36)
    private String jti;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false, updatable = false)
    private User user;

    @Column(name = "deviceFingerprint", length = 128)
    private String deviceFingerprint;

    @Column(name = "ipAddress", length = 45)
    private String ipAddress;

    @Column(name = "userAgent", length = 500)
    private String userAgent;

    @CreationTimestamp
    @Column(name = "createdAt", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "expiresAt", nullable = false)
    private Instant expiresAt;

    @Column(name = "lastUsedAt")
    private Instant lastUsedAt;

    @Column(name = "revoked", nullable = false)
    private boolean revoked;

    @Column(name = "revokedAt")
    private Instant revokedAt;

    @Column(name = "replacedByToken", length = 36)
    private String replacedByToken;

    @Version
    @Column(name = "version")
    private Long version;

    // Helper methods
    public boolean isValid() {
        return !revoked && expiresAt.isAfter(Instant.now());
    }

    public boolean isExpired() {
        return expiresAt.isBefore(Instant.now());
    }

    public void revoke() {
        this.revoked = true;
        this.revokedAt = Instant.now();
    }

    public void revoke(String replacedBy) {
        this.revoked = true;
        this.revokedAt = Instant.now();
        this.replacedByToken = replacedBy;
    }

    public void updateLastUsed() {
        this.lastUsedAt = Instant.now();
    }

    public boolean matchesDevice(String fingerprint) {
        if (this.deviceFingerprint == null || fingerprint == null) {
            return false;
        }
        return this.deviceFingerprint.equals(fingerprint);
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (revoked && revokedAt == null) {
            revokedAt = Instant.now();
        }
    }
}