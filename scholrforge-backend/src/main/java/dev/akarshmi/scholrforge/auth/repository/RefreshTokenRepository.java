package dev.akarshmi.scholrforge.auth.repository;

import dev.akarshmi.scholrforge.auth.entity.RefreshToken;
import dev.akarshmi.scholrforge.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByJti(String jti);

    List<RefreshToken> findByUserAndRevokedFalse(User user);

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revoked = true, rt.revokedAt = :now WHERE rt.user.userId = :userId")
    int revokeAllUserTokens(@Param("userId") UUID userId, @Param("now") Instant now);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.expiresAt < :cutoff")
    int deleteExpiredTokens(@Param("cutoff") Instant cutoff);

    @Modifying
    @Query("DELETE FROM RefreshToken rt WHERE rt.revoked = true AND rt.revokedAt < :cutoff")
    int deleteOldRevokedTokens(@Param("cutoff") Instant cutoff);

    long countByUserAndRevokedFalse(User user);

    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user.userId = :userId AND rt.revoked = false")
    List<RefreshToken> findActiveTokensByUser(@Param("userId") UUID userId);
}