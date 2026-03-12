package dev.akarshmi.scholrforge.user.service;

import dev.akarshmi.scholrforge.user.dto.UserResponseDto;
import dev.akarshmi.scholrforge.user.dto.UserUpdateDto;
import dev.akarshmi.scholrforge.user.entity.User;
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
    User findUserByUsername(String username);



}
