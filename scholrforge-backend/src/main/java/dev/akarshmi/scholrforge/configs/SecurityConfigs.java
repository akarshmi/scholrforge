package dev.akarshmi.scholrforge.configs;

import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.auth.security.JWTAuthenticationFilter;
import dev.akarshmi.scholrforge.common.constants.ProjectConstants;
import dev.akarshmi.scholrforge.common.constants.UserConstants;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class SecurityConfigs {

    private final JWTAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests( authorizeRequests -> authorizeRequests
                        .requestMatchers("/api/v4/users/me").authenticated()
                        .requestMatchers("/api/v4/users/me/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/v4/projects").authenticated()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/register").permitAll()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/refresh").permitAll()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/login").permitAll()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/ping").permitAll()
                        .requestMatchers(AuthConstants.AUTH_BASE_URL+"/logout").permitAll()
                        .requestMatchers(HttpMethod.GET, ProjectConstants.PROJECT_BASE_URL+"/**").permitAll()
                        .requestMatchers(HttpMethod.GET, ProjectConstants.PROJECT_BASE_URL+"/explore").permitAll()
                        .requestMatchers(HttpMethod.GET,UserConstants.USER_BASE_URL+"/**").permitAll()
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


    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${scholrforge.auth.cors.FRONTEND-URL}") String corsUrls,
            @Value("${scholrforge.auth.cors.MAX-AGE}") Long maxAge
    ) {
        String[] urls = corsUrls.trim().split(",");
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.stream(urls)
                .map(String::trim)
                .collect(Collectors.toList()));

        config.setAllowedMethods(Arrays.asList(
                "POST", "GET", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        config.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        config.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Content-Disposition"
        ));

        config.setAllowCredentials(true);
        config.setMaxAge(maxAge);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        source.registerCorsConfiguration("/api/**", config);

        return source;
    }
}
