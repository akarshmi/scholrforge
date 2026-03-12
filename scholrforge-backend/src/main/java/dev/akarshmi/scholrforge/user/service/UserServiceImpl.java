package dev.akarshmi.scholrforge.user.service;

import dev.akarshmi.scholrforge.common.helper.UserMapperInterface;
import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.user.dto.UserResponseDto;
import dev.akarshmi.scholrforge.user.dto.UserUpdateDto;
import dev.akarshmi.scholrforge.auth.exception.validation.UserDoesNotExistsException;
import dev.akarshmi.scholrforge.common.helper.UserHelper;
import dev.akarshmi.scholrforge.user.entity.User;
import dev.akarshmi.scholrforge.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Consumer;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private UserMapperInterface userMapperInterface;


    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapperInterface userMapperInterface) {
        this.userRepository = userRepository;
        this.userMapperInterface = userMapperInterface;
    }

    @Transactional
    @Override
    public UserResponseDto updateUser(String uuid, UserUpdateDto dto) {
        User user = userRepository.findById(UUID.fromString(uuid))
                .orElseThrow(() -> new UserDoesNotExistsException(AuthConstants.USER_DOES_NOT_EXISTS));

        updateIfPresent(dto.username(), user::setUsername);
        updateIfPresent(dto.name(),     user::setName);
        updateIfPresent(dto.phone(),    user::setPhone);
        updateIfPresent(dto.avatarUrl(), user::setAvatarUrl);

        return userMapperInterface.toResponseDto(userRepository.save(user));
    }

    private void updateIfPresent(String value, Consumer<String> setter) {
        if (value != null && !value.isBlank()) {
            setter.accept(value);
        }
    }
    @Override
    public void deleteUser(String uuid) {
        //parsing the String uid to uuid
        UUID uid = UserHelper.parseUUID(uuid);

        // validating that is the user already exists or not
        validateUpdateRequest(uid);
        userRepository.deleteById(uid);

    }

    private void validateUpdateRequest(UUID uid) {
        if (!userRepository.existsByEmail(uid.toString())) {
            throw new UserDoesNotExistsException(AuthConstants.USER_DOES_NOT_EXISTS);
        }

    }

    @Override
    public Optional<UserResponseDto> getUserById(String uuid) {
        return Optional.empty();
    }

    @Override
    public Optional<UserResponseDto> getUserByEmail(String email) {
        return Optional.empty();
    }

    @Override
    public Optional<UserResponseDto> getUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            throw new AccessDeniedException(AuthConstants.UNAUTHORIZED_ACCESS);
        }
        if (user == null) {
            throw new AccessDeniedException(AuthConstants.UNAUTHORIZED_ACCESS);
        }
        if (!auth.getName().equals(user.getEmail())){
            throw new AccessDeniedException(AuthConstants.UNAUTHORIZED_ACCESS);
        }
        return Optional.ofNullable(userMapperInterface.toResponseDto(user));
    }

    @Override
    public Iterable<UserResponseDto> getAllUsers() {
        return null;
    }

    @Override
    public User findUserByUsername(String username) {
        return null;
    }


}
