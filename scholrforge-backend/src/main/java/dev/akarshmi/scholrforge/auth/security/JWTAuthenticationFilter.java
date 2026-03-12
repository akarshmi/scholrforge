package dev.akarshmi.scholrforge.auth.security;

import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.auth.dto.TokenInfo;
import dev.akarshmi.scholrforge.auth.exception.AuthException;
import dev.akarshmi.scholrforge.user.repository.UserRepository;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;
@Slf4j
@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JWTService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            //Extract The Token
            String token = header.substring(7);
            try{
                TokenInfo tokenInfo = jwtService.validateToken(token);

                if (!"access".equals(tokenInfo.getTokenType())) {
                    filterChain.doFilter(request, response);
                    return;
                }

                UUID userId = tokenInfo.getUserId();

                userRepository.findById(userId).ifPresent(user -> {
                   SecurityUser secureUser = new SecurityUser(user);
                   UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                           secureUser,
                           null,
                           secureUser.getAuthorities()
                   );
                   //till here we had get the user and created an authentication token but bot set in the security context

                    //now we will setDetails  (sessionId etc)
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    //now set the authentication in  the security context and send to further filters
                    if (SecurityContextHolder.getContext().getAuthentication() == null){
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                });


            }catch (ExpiredJwtException ex) {
                request.setAttribute("error", AuthConstants.TOKEN_EXPIRED);

            } catch (SecurityException ex) {
                request.setAttribute("error", AuthConstants.TOKEN_INVALID);

            } catch (MalformedJwtException ex) {
                request.setAttribute("error", AuthConstants.TOKEN_MALFORMED);

            } catch (UnsupportedJwtException ex) {
                request.setAttribute("error", AuthConstants.TOKEN_UNSUPPORTED);

            } catch (IllegalArgumentException ex) {
                request.setAttribute("error", AuthConstants.TOKEN_EMPTY);

            } catch (JwtException ex) {
                request.setAttribute("error", AuthConstants.TOKEN_MALFORMED);

            } catch (AuthException e) {
                request.setAttribute("error", AuthConstants.TOKEN_INVALID);

            } catch (Exception e) {
                request.setAttribute("error", AuthConstants.UNEXPECTED_ERROR);
            }
        }

        // If there is no token then go as usual without these configurations
        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getRequestURI().startsWith("/api/v3/auth");
    }

}
