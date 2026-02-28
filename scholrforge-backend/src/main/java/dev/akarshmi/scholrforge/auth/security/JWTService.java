package dev.akarshmi.scholrforge.auth.security;

import dev.akarshmi.scholrforge.constants.AuthConstants;
import dev.akarshmi.scholrforge.auth.dto.TokenInfo;
import dev.akarshmi.scholrforge.auth.entity.User;
import dev.akarshmi.scholrforge.auth.exception.AuthException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@Getter
@Setter
public class JWTService {
    private final SecretKey SECRET_KEY;
    private final long ACCESS_TOKEN_TTL;
    private final long REFRESH_TOKEN_TTL;
    private final String ISSUER;


    public JWTService(
            @Value("${scholrforge.auth.jwt.SECRET}") String secretKey,
            @Value("${scholrforge.auth.jwt.ACCESS-TOKEN-TTL}") long accessTokenTtl,
            @Value("${scholrforge.auth.jwt.REFRESH-TOKEN-TTL}") long refreshTokenTtl,
            @Value("${scholrforge.auth.jwt.ISSUER}") String issuer
    ) {
        if (secretKey == null || secretKey.isEmpty()) {
            throw new AuthException(AuthConstants.TOKEN_NOT_FOUND);
        }
        this.SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
        this.ACCESS_TOKEN_TTL = accessTokenTtl;
        this.REFRESH_TOKEN_TTL = refreshTokenTtl;
        this.ISSUER = issuer;
    }


    // First We generate AccessToken
    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .id(UUID.randomUUID().toString())
                .subject(user.getUserId().toString())
                .issuer(ISSUER)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(ACCESS_TOKEN_TTL)))
                .claims(Map.of(
                        "email", user.getEmail(),
                        "role", user.getRole(),
                        "type", "access"
                ))
                .signWith(SECRET_KEY, Jwts.SIG.HS256)
                .compact();
    }

    // Now generate RefreshToken
    public String generateRefreshToken(User user,String jti) {
        Instant now = Instant.now();
        return Jwts.builder()
                .id(jti)
                .subject(user.getUserId().toString())
                .issuer(ISSUER)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(REFRESH_TOKEN_TTL)))
                .claims(Map.of(
                        "type", "refresh"
                ))
                .signWith(SECRET_KEY, Jwts.SIG.HS256)
                .compact();
    }


    private Jws<Claims> parseToken(String token) {
       try{
           return Jwts.parser()
                   .verifyWith(SECRET_KEY)
                   .build()
                   .parseSignedClaims(token);
       }catch (ExpiredJwtException e) {
           throw new AuthException(AuthConstants.TOKEN_EXPIRED);
       }
       catch (JwtException e) {
           throw new AuthException(AuthConstants.TOKEN_INVALID);
       }
    }

    public TokenInfo validateToken(String token) {
        Jws<Claims> jwsClaims = parseToken(token);
        Claims claims  = jwsClaims.getPayload();

        String tokenType = claims.get("type", String.class);
        TokenInfo.TokenInfoBuilder builder = TokenInfo.builder()
                .userId(UUID.fromString(claims.getSubject()))
                .jti(claims.getId())
                .tokenType(tokenType)
                .issuedAt(claims.getIssuedAt().toInstant())
                .expiration(claims.getExpiration().toInstant());

        // Only add email/role for access tokens
        if ("access".equals(tokenType)) {
            builder.email(claims.get("email", String.class))
                    .role(claims.get("role", String.class));
        }

        return builder.build();
    }

    public boolean isAccessToken(String token) {
        try {
            TokenInfo info = validateToken(token);
            return "access".equals(info.getTokenType());
        } catch (AuthException e) {
            return false;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            TokenInfo info = validateToken(token);
            return "refresh".equals(info.getTokenType());
        } catch (AuthException e) {
            return false;
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            TokenInfo info = validateToken(token);
            return info.getExpiration().isBefore(Instant.now());
        } catch (AuthException e) {
            return true; // Invalid token considered expired
        }
    }

    // Quick access to user ID without full validation (use carefully)
    public UUID extractUserIdUnsafe(String token) {
        try {
            return UUID.fromString(parseToken(token).getPayload().getSubject());
        } catch (Exception e) {
            return null;
        }
    }

    public String getJTI(String token) {
        try {
            return parseToken(token).getPayload().getId();
        }catch (Exception e) {
            return null;
        }
    }

}
