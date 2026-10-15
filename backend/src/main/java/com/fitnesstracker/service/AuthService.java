package com.fitnesstracker.service;

import com.fitnesstracker.dto.AuthRequest;
import com.fitnesstracker.dto.AuthResponse;
import com.fitnesstracker.dto.RegisterRequest;
import com.fitnesstracker.entity.Role;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.exception.BadRequestException;
import com.fitnesstracker.dao.RoleDao;
import com.fitnesstracker.dao.UserDao;
import com.fitnesstracker.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * AuthService
 * Handles user login, registration, password hashing, and token generation using JDBC DAOs.
 */
@Service
public class AuthService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    /**
     * Authenticate an existing user with email and password
     */
    public AuthResponse login(AuthRequest request) {
        // Validate credentials using Spring Security AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Fetch user from database via JDBC
        User user = userDao.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found with email: " + request.getEmail()));

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Return token and user data
        return new AuthResponse(token, user, "Login successful");
    }

    /**
     * Register a new user account with hashed password
     */
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists via JDBC
        if (userDao.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        // Determine user role (default is Athlete / USER)
        String roleName = "Athlete";
        if (request.getEmail().toLowerCase().contains("admin")) {
            roleName = "System Admin";
        }

        // Find or create role entity via JDBC
        java.util.Optional<Role> roleOpt = roleDao.findByName(roleName);
        Role role;
        if (roleOpt.isPresent()) {
            role = roleOpt.get();
        } else {
            role = roleDao.save(new Role(roleName));
        }

        // Create new User entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // Hash the plain-text password using BCrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setUserRole(role);
        user.setRole(roleName);
        user.setFitnessGoal(request.getFitnessGoal() != null ? request.getFitnessGoal() : "General Fitness");
        user.setActivityLevel(request.getActivityLevel() != null ? request.getActivityLevel() : "Moderately Active");
        user.setWeight(request.getWeight() != null ? request.getWeight() : 75.0);
        user.setTargetWeight(request.getTargetWeight() != null ? request.getTargetWeight() : 78.0);
        user.setHeight(request.getHeight() != null ? request.getHeight() : 175.0);
        user.setAge(request.getAge() != null ? request.getAge() : 25);
        user.setStatus("Active");
        user.setActiveStreak(1);
        user.setWorkoutsCompleted(0);
        user.setTotalCaloriesBurned(0);
        user.setMembershipTier("Pro Athlete");
        user.setJoinedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        user.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80");

        // Save user to MySQL database via JDBC
        User savedUser = userDao.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail());

        return new AuthResponse(token, savedUser, "Account successfully registered");
    }
}
