package dev.akarshmi.scholrforge.auth.service;

import dev.akarshmi.scholrforge.auth.dto.LoginRequestDto;
import dev.akarshmi.scholrforge.auth.dto.RegisterRequestDto;
import dev.akarshmi.scholrforge.auth.dto.TokenResponseDto;
import dev.akarshmi.scholrforge.user.dto.UserResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthService {

    UserResponseDto registerUser(RegisterRequestDto registerRequestDto);
    TokenResponseDto loginUser(LoginRequestDto loginRequestDto, HttpServletRequest request, HttpServletResponse response);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
