package dev.akarshmi.scholrforge.configs;

import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.auth.security.JWTAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfigs {

    private final JWTAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    @Order(1)
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests( authorizeRequests -> authorizeRequests
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/register").permitAll()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/refresh").permitAll()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/login").permitAll()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/ping").permitAll()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/logout").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authEx) -> {

                    authEx.printStackTrace();
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);

                    String message = AuthConstants.UNAUTHORIZED_ACCESS;

                    // Check if we have a custom error message from filter
                    Object errorAttr = request.getAttribute("error");
                    if (errorAttr != null) {
                        message = errorAttr.toString();
                    }
                    Map<String, Object> errorResponse = new HashMap<>();
                    errorResponse.put("timestamp", Instant.now().toString());
                    errorResponse.put("status", HttpServletResponse.SC_UNAUTHORIZED);
                    errorResponse.put("error", "Unauthorized Access");
                    errorResponse.put("message", message);
                    errorResponse.put("path", request.getRequestURI());

                    ObjectMapper objectMapper = new ObjectMapper();
                    response.getWriter().write(objectMapper.writeValueAsString(errorResponse));

                }))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }



    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
