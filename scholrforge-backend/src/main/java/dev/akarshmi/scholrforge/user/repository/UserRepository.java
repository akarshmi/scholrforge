package dev.akarshmi.scholrforge.user.repository;

import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.user.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    boolean existsByEmail(@NotBlank(message = AuthConstants.EMAIL_NOT_BLANK) @Email(message = AuthConstants.EMAIL_INVALID) String email);
//    User getByUserId(@NotBlank(message = AuthConstants.USERNAME_NOT_BLANK) UUID userId);
    boolean existsByUsername(@NotBlank(message = AuthConstants.USERNAME_NOT_BLANK) String username);
    User findByUsername(@NotBlank(message = AuthConstants.USERNAME_NOT_BLANK) String username);
    Optional<User> getByEmail(@NotBlank(message = AuthConstants.EMAIL_NOT_BLANK) String email);
    User findByEmail(@NotBlank(message = AuthConstants.EMAIL_NOT_BLANK) String email);
}
