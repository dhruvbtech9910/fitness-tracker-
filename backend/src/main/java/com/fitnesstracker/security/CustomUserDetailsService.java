package com.fitnesstracker.security;

import com.fitnesstracker.entity.User;
import com.fitnesstracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * CustomUserDetailsService
 * Bridges our User entity and database with Spring Security's authentication system.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Find user by email in database
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Determine user authority (ROLE_ADMIN or ROLE_USER)
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        String roleStr = user.getRole();
        if (roleStr != null && (roleStr.equalsIgnoreCase("System Admin") || roleStr.equalsIgnoreCase("ADMIN") || roleStr.equalsIgnoreCase("ROLE_ADMIN"))) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }

        // Return Spring Security's User object with email, hashed password, and authorities
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}
