package dev.akarshmi.scholrforge.auth.repository;

import dev.akarshmi.scholrforge.constants.AuthConstants;
import dev.akarshmi.scholrforge.auth.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmail(@NotBlank(message = AuthConstants.EMAIL_NOT_BLANK) @Email(message = AuthConstants.EMAIL_INVALID) String email);
    boolean existsByUsername(@NotBlank(message = AuthConstants.USERNAME_NOT_BLANK) String username);

    User findByUsername(@NotBlank(message = AuthConstants.USERNAME_NOT_BLANK) String username);
    Optional<User> getByEmail(@NotBlank(message = AuthConstants.EMAIL_NOT_BLANK) String email);
    User findByEmail(@NotBlank(message = AuthConstants.EMAIL_NOT_BLANK) String email);
}
