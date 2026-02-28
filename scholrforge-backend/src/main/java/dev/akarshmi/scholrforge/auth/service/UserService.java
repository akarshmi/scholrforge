package dev.akarshmi.scholrforge.auth.service;

import dev.akarshmi.scholrforge.auth.dto.UserResponseDto;
import dev.akarshmi.scholrforge.auth.dto.UserUpdateDto;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface UserService{

    UserResponseDto updateUser(String uuid, UserUpdateDto userUpdateDto);
    void deleteUser(String uuid);
    Optional<UserResponseDto> getUserById(String uuid);
    Optional<UserResponseDto> getUserByEmail(String email);
    Optional<UserResponseDto> getUserByUsername(String username);
    Iterable<UserResponseDto> getAllUsers();

}
