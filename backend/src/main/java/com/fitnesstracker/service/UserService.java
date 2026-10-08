package com.fitnesstracker.service;

import com.fitnesstracker.entity.User;
import com.fitnesstracker.exception.ResourceNotFoundException;
import com.fitnesstracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * UserService
 * Manages user profile queries, profile updates, and bio metric calculations.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieve current profile by email
     */
    public User getProfileByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    /**
     * Update user profile information
     */
    public User updateProfile(String email, User updates) {
        User user = getProfileByEmail(email);

        if (updates.getName() != null && !updates.getName().trim().isEmpty()) {
            user.setName(updates.getName());
        }
        if (updates.getFitnessGoal() != null) {
            user.setFitnessGoal(updates.getFitnessGoal());
        }
        if (updates.getActivityLevel() != null) {
            user.setActivityLevel(updates.getActivityLevel());
        }
        if (updates.getWeight() != null) {
            user.setWeight(updates.getWeight());
        }
        if (updates.getTargetWeight() != null) {
            user.setTargetWeight(updates.getTargetWeight());
        }
        if (updates.getHeight() != null) {
            user.setHeight(updates.getHeight());
        }
        if (updates.getAge() != null) {
            user.setAge(updates.getAge());
        }
        if (updates.getAvatar() != null) {
            user.setAvatar(updates.getAvatar());
        }

        return userRepository.save(user);
    }

    /**
     * Find user by ID
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }
}
