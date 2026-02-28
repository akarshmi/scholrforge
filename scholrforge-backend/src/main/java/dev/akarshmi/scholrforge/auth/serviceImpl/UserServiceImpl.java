package dev.akarshmi.scholrforge.auth.serviceImpl;

import dev.akarshmi.scholrforge.constants.AuthConstants;
import dev.akarshmi.scholrforge.auth.dto.UserResponseDto;
import dev.akarshmi.scholrforge.auth.dto.UserUpdateDto;
import dev.akarshmi.scholrforge.auth.exception.validation.UserDoesNotExistsException;
import dev.akarshmi.scholrforge.auth.helper.UserHelper;
import dev.akarshmi.scholrforge.auth.repository.UserRepository;
import dev.akarshmi.scholrforge.auth.service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@Getter
@Setter
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserResponseDto updateUser(String uuid, UserUpdateDto userUpdateDto) {
        return null;
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
        return Optional.empty();
    }

    @Override
    public Iterable<UserResponseDto> getAllUsers() {
        return null;
    }






}
