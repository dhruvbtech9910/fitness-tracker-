package com.fitnesstracker.service;

import com.fitnesstracker.entity.FitnessContent;
import com.fitnesstracker.entity.Role;
import com.fitnesstracker.entity.SystemSetting;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.exception.ResourceNotFoundException;
import com.fitnesstracker.repository.FitnessContentRepository;
import com.fitnesstracker.repository.RoleRepository;
import com.fitnesstracker.repository.SystemSettingRepository;
import com.fitnesstracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * AdminService
 * Provides administrative control over users, content curation, and system configurations.
 */
@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private FitnessContentRepository contentRepository;

    @Autowired
    private SystemSettingRepository settingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Retrieve all registered users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Create a user via Admin panel
     */
    public User createUser(User user) {
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode("athlete123"));
        } else {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        String roleName = user.getRole() != null ? user.getRole() : "Athlete";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));
        user.setUserRole(role);
        user.setRole(roleName);
        user.setStatus("Active");
        user.setActiveStreak(1);
        user.setWorkoutsCompleted(0);
        user.setTotalCaloriesBurned(0);
        user.setJoinedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));

        return userRepository.save(user);
    }

    /**
     * Update user details or toggle active/suspended status
     */
    public User updateUser(Long id, User updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (updates.getName() != null) user.setName(updates.getName());
        if (updates.getEmail() != null) user.setEmail(updates.getEmail());
        if (updates.getRole() != null) user.setRole(updates.getRole());
        if (updates.getStatus() != null) user.setStatus(updates.getStatus());

        return userRepository.save(user);
    }

    /**
     * Delete user account permanently
     */
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    /**
     * Retrieve curated workout content
     */
    public List<FitnessContent> getAllCuratedContent() {
        return contentRepository.findAll();
    }

    /**
     * Create curated workout content
     */
    public FitnessContent createCuratedContent(FitnessContent content) {
        return contentRepository.save(content);
    }

    /**
     * Delete curated content
     */
    public void deleteCuratedContent(Long id) {
        FitnessContent content = contentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found with id: " + id));
        contentRepository.delete(content);
    }

    /**
     * Retrieve all system settings
     */
    public List<SystemSetting> getSystemSettings() {
        return settingRepository.findAll();
    }

    /**
     * Update or insert system setting
     */
    public SystemSetting updateSystemSetting(String key, String value, String description) {
        Optional<SystemSetting> settingOpt = settingRepository.findBySettingKey(key);
        SystemSetting setting;
        if (settingOpt.isPresent()) {
            setting = settingOpt.get();
            setting.setSettingValue(value);
            if (description != null) setting.setDescription(description);
        } else {
            setting = new SystemSetting(key, value, description);
        }
        return settingRepository.save(setting);
    }
}
