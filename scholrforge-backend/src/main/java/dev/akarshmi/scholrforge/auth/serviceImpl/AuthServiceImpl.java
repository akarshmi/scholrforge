package dev.akarshmi.scholrforge.auth.serviceImpl;
import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.auth.dto.LoginRequestDto;
import dev.akarshmi.scholrforge.auth.dto.RegisterRequestDto;
import dev.akarshmi.scholrforge.auth.dto.TokenResponseDto;
import dev.akarshmi.scholrforge.user.dto.UserResponseDto;
import dev.akarshmi.scholrforge.auth.entity.*;
import dev.akarshmi.scholrforge.auth.exception.validation.*;
import dev.akarshmi.scholrforge.auth.exception.validation.BadCredentialsException;
import dev.akarshmi.scholrforge.common.helper.UserMapperInterface;
import dev.akarshmi.scholrforge.auth.repository.RefreshTokenRepository;
import dev.akarshmi.scholrforge.user.repository.UserRepository;
import dev.akarshmi.scholrforge.auth.security.JWTService;
import dev.akarshmi.scholrforge.auth.security.SecurityUser;
import dev.akarshmi.scholrforge.auth.service.AuthService;
import dev.akarshmi.scholrforge.user.entity.Provider;
import dev.akarshmi.scholrforge.user.entity.Role;
import dev.akarshmi.scholrforge.user.entity.User;
import dev.akarshmi.scholrforge.user.entity.UserStatus;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapperInterface  userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final RefreshTokenRepository refreshTokenRepository;




    @Override
    public UserResponseDto registerUser(RegisterRequestDto dto) {
        //validate request dto
        validateRegisterRequestDto(dto);
        // now verify the dto
        verifyRegisterRequestDto(dto);
        //create user
        User user = createUser(dto);
        //save user to db
        User savedUser = userRepository.save(user);
        //map user to user response dto
        UserResponseDto mappedUser = userMapper.toResponseDto(savedUser);
        //return response in responseDto
        return mappedUser;
    }


    @Override
    public TokenResponseDto loginUser(LoginRequestDto dto, HttpServletRequest request, HttpServletResponse response) {

        try {
            // 1. Create authentication token
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            dto.email(),
                            dto.password()
                    );

            // 2. Let Spring Security authenticate
            // This will automatically:
            // - Call CustomUserDetailService.loadUserByUsername()
            // - Check password using PasswordEncoder
            // - Return Authentication with SecurityUser
            Authentication authentication = authenticationManager.authenticate(authToken);

            // 3. Get the SecurityUser from authentication
            SecurityUser securityUser = (SecurityUser) authentication.getPrincipal();

            // 4. Get the actual User entity
            assert securityUser != null;
            User user = securityUser.getUser();

//            log.info("User authenticated successfully: {}", user.getEmail());

            // 5. Generate tokens
            String accessToken = jwtService.generateAccessToken(user);

            String jti = UUID.randomUUID().toString();
            RefreshToken refreshTokenEntity = RefreshToken.builder()
                    .jti(jti)
                    .user(user)
                    .deviceFingerprint(generateDeviceFingerprint(request))
                    .ipAddress(request.getRemoteAddr())
                    .userAgent(request.getHeader(HttpHeaders.USER_AGENT))
                    .createdAt(Instant.now())
                    .expiresAt(Instant.now().plusSeconds(jwtService.getREFRESH_TOKEN_TTL()))
                    .revoked(false)
                    .build();

            refreshTokenRepository.save(refreshTokenEntity);
            String refreshToken = jwtService.generateRefreshToken(user, jti);




            // 6. Return response
            return TokenResponseDto.of(
                    accessToken,
                    refreshToken,
                    jwtService.getACCESS_TOKEN_TTL(),
                    userMapper.toTokenResponseDto(user).user()
            );

        } catch (BadCredentialsException e) {
            log.warn("Failed login attempt for email: {}", dto.email());
            throw new BadCredentialsException(AuthConstants.INVALID_CREDENTIALS);
        } catch (DisabledException e) {
            log.warn("Disabled account attempted login: {}", dto.email());
            throw new DisabledException("Account is disabled");
        } catch (LockedException e) {
            log.warn("Locked account attempted login: {}", dto.email());
            throw new LockedException("Account is locked");
        } catch (Exception e) {
            log.error("Login error for email: {}", dto.email(), e);
            throw new InternalAuthenticationServiceException("Authentication failed");
        }
    }

    public static String generateDeviceFingerprint(HttpServletRequest request) {
        String userAgent = request.getHeader("User-Agent");
        String accept = request.getHeader("Accept");
        String acceptLanguage = request.getHeader("Accept-Language");
        return Integer.toHexString((userAgent + accept + acceptLanguage).hashCode());
    }



    @Override
    public boolean existsByEmail(String email) {
        return false;
    }

    @Override
    public boolean existsByUsername(String username) {
        return false;
    }

    void validateRegisterRequestDto(RegisterRequestDto dto)  {
        if(dto.email().isBlank()){
            throw new InvalidEmailException(AuthConstants.EMAIL_NOT_BLANK);
        }
        if(dto.username().isBlank()) {
            throw new InvalidUsernameException(AuthConstants.USERNAME_NOT_BLANK);
        }
        if (dto.name().isBlank()) {
            throw new InvalidNameException(AuthConstants.NAME_NOT_BLANK);
        }
    }

    void verifyRegisterRequestDto(RegisterRequestDto dto) {
        if (userRepository.existsByEmail(dto.email())){
            throw new EmailAlreadyExistsException(AuthConstants.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByUsername(dto.username())){
            throw new UsernameAlreadyExistsException(AuthConstants.USERNAME_ALREADY_EXISTS);
        }
    }

    User createUser(RegisterRequestDto dto) {
        User user = User.builder()
                .name(dto.name())
                .username(dto.username())
                .email(dto.email())
                .passwordHash(passwordEncoder.encode(dto.password()))
                .phone(dto.phone())
                .emailVerified(false)
                .provider(Provider.LOCAL)
                .avatarUrl(dto.avtarUrl())
                .role(Role.USER)
                .status(UserStatus.PENDING)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        return user;
    }
}