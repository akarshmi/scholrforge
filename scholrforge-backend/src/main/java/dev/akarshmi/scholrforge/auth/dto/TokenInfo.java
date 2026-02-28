package dev.akarshmi.scholrforge.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class TokenInfo {

    private UUID userId;
    private String email;
    private String tokenType;
    private String jti;
    private String role;
    private Instant issuedAt;
    private Instant expiration;

    public boolean isAccessToken() {
        return "access".equals(tokenType);
    }

    public boolean isRefreshToken() {
        return "refresh".equals(tokenType);
    }

    public boolean isExpired() {
        return expiration.isBefore(Instant.now());
    }
}
