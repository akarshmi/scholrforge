package dev.akarshmi.scholrforge.auth.security;

import dev.akarshmi.scholrforge.common.constants.AuthConstants;
import dev.akarshmi.scholrforge.user.entity.User;
import dev.akarshmi.scholrforge.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.getByEmail(username).orElseThrow(()-> new UsernameNotFoundException(AuthConstants.INVALID_CREDENTIALS));
        return new SecurityUser(user);
    }
}
