package com.fitnesstracker.controller;

import com.fitnesstracker.entity.User;
import com.fitnesstracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

/**
 * UserController
 * Endpoints for retrieving and updating user profile details.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * GET /api/users/profile
     * Fetch profile of the logged-in user
     */
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Principal principal, Authentication authentication) {
        String email = "alex.vance@fitpulse.pro"; // fallback if principal is null
        if (principal != null) {
            email = principal.getName();
        } else if (authentication != null) {
            email = authentication.getName();
        }
        User user = userService.getProfileByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * PUT /api/users/profile
     * Update profile details for the logged-in user
     */
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User updates, Principal principal, Authentication authentication) {
        String email = "alex.vance@fitpulse.pro";
        if (principal != null) {
            email = principal.getName();
        } else if (authentication != null) {
            email = authentication.getName();
        }
        User updated = userService.updateProfile(email, updates);
        return ResponseEntity.ok(updated);
    }
}
