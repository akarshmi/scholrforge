package dev.akarshmi.scholrforge.auth.controller;

import dev.akarshmi.scholrforge.auth.dto.*;
import dev.akarshmi.scholrforge.auth.entity.RefreshToken;
import dev.akarshmi.scholrforge.user.dto.UserResponseDto;
import dev.akarshmi.scholrforge.user.entity.User;
import dev.akarshmi.scholrforge.auth.exception.validation.InvalidRefreshTokenException;
import dev.akarshmi.scholrforge.common.helper.UserMapperInterface;
import dev.akarshmi.scholrforge.auth.repository.RefreshTokenRepository;
import dev.akarshmi.scholrforge.auth.serviceImpl.AuthServiceImpl;
import dev.akarshmi.scholrforge.common.constants.AuthConstants;

import dev.akarshmi.scholrforge.auth.security.JWTService;
import dev.akarshmi.scholrforge.auth.service.AuthService;
import dev.akarshmi.scholrforge.auth.service.CookieService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(AuthConstants.AUTH_BASE_URL)
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;
    private final JWTService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapperInterface userMapper;



    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> registerUser(@Valid @RequestBody RegisterRequestDto dto) {
        return ResponseEntity.ok(authService.registerUser(dto));
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponseDto> login(
            @Valid @RequestBody LoginRequestDto loginRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        TokenResponseDto tokenResponseDto = authService.loginUser(loginRequest, request, response);
        cookieService.attachRefreshCookie(response,tokenResponseDto.refreshToken(), (int) jwtService.getREFRESH_TOKEN_TTL());
        cookieService.addNoStoreHeaders(response);
        return ResponseEntity.ok(tokenResponseDto);

    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponseDto> refreshTokens(@Valid @RequestBody(required = false) RefreshTokenRequestDto refreshTokenRequestDto, HttpServletResponse response, HttpServletRequest request) {
        String refreshToken = readRefreshTokenFromRequest(refreshTokenRequestDto,request).orElseThrow(()-> new InvalidRefreshTokenException(AuthConstants.REFRESH_TOKEN_NOT_FOUND));
        if (!jwtService.isRefreshToken(refreshToken)) {
        System.out.println(refreshToken);
            throw new IllegalArgumentException(AuthConstants.TOKEN_INVALID);
        }

        String jti = jwtService.getJTI(refreshToken);
        UUID uuid = jwtService.extractUserIdUnsafe(refreshToken);
        RefreshToken storedRefreshToken = refreshTokenRepository.findByJti(jti).orElseThrow(InvalidRefreshTokenException::new);
        if (storedRefreshToken.isExpired()) {
            throw new InvalidRefreshTokenException(AuthConstants.TOKEN_EXPIRED);
        }
        if (storedRefreshToken.isRevoked()) {
            throw new InvalidRefreshTokenException(AuthConstants.TOKEN_REVOKED);
        }

        if (!storedRefreshToken.getUser().getUserId().equals(uuid)) {
            throw new BadCredentialsException(AuthConstants.TOKEN_MISMATCH);
        }
        String newJti = UUID.randomUUID().toString();
        storedRefreshToken.revoke(newJti);
        refreshTokenRepository.save(storedRefreshToken);

        User user = storedRefreshToken.getUser();
        var newRefreshTokenObj = RefreshToken.builder()
                .jti(newJti)
                .user(user)
                .deviceFingerprint(AuthServiceImpl.generateDeviceFingerprint(request))
                .ipAddress(request.getRemoteAddr())
                .userAgent(request.getHeader(HttpHeaders.USER_AGENT))
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(jwtService.getREFRESH_TOKEN_TTL()))
                .revoked(false)
                .build();

        refreshTokenRepository.save(newRefreshTokenObj);

        String newAccessToken = jwtService.generateAccessToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user,newRefreshTokenObj.getJti());
        TokenResponseDto tokenResponse = TokenResponseDto.of(newAccessToken,newRefreshToken,jwtService.getACCESS_TOKEN_TTL(), userMapper.toTokenResponseDto(user).user());
        return ResponseEntity.ok(tokenResponse);
    }

    private Optional<String> readRefreshTokenFromRequest(@Valid RefreshTokenRequestDto refreshTokenRequestDto, HttpServletRequest request) {
//        1. Prefer Reading refresh token from cookie

        if (request.getCookies() != null) {
            Optional<String> fromCookie = Arrays.stream(
                    request.getCookies()
            ).filter(cookie -> cookieService.getRefreshTokenCookieName().equals(cookie.getName())).map(Cookie::getValue).filter(v -> !v.isBlank()).findFirst();
            if (fromCookie.isPresent()) {
                return fromCookie;
            }
        }

//        2. if the cookie is in the JSON body
        if (refreshTokenRequestDto!=null && refreshTokenRequestDto.refreshToken() != null && !refreshTokenRequestDto.refreshToken().isEmpty()) {
            return Optional.of(refreshTokenRequestDto.refreshToken());
        }

        // 3. custom header

        String refreshHeader = request.getHeader("X-Refresh-Token");
        if (refreshHeader != null && !refreshHeader.isBlank()) {
            return Optional.of(refreshHeader.trim());
        }

        // Authorization  = Bearer <token>
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String candidate = authHeader.substring(7).trim();
            if (!candidate.isEmpty()) {
                try {
                    if (jwtService.isRefreshToken(candidate)) {
                        return Optional.of(candidate);
                    }
                }catch (Exception ignored){

                }
            }
        }
        return Optional.empty();
    }



    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        readRefreshTokenFromRequest(null, request).ifPresent(token -> {
//            IO.println("Logging out!!!");
            try {
                if (jwtService.isRefreshToken(token)) {
                    String jti = jwtService.getJTI(token);
                    refreshTokenRepository.findByJti(jti).ifPresent(rt -> {
                        rt.setRevoked(true);
                        refreshTokenRepository.save(rt);
                    });
                }
            } catch (JwtException ignored) {
            }
        });

        // Use CookieUtil (same behavior)
        cookieService.clearRefreshCookie(response);
        cookieService.addNoStoreHeaders(response);
        SecurityContextHolder.clearContext();
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }




    @GetMapping("/ping")
    public String getPing() {
        return "pong";
    }

    @PostMapping("/ping")
    public String postPing() {
      return "pong";
    }

    @PostMapping("/pong")
    public String postPong() {
        return "pong";
    }

}