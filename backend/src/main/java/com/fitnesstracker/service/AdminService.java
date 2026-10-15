package com.fitnesstracker.service;

import com.fitnesstracker.dao.AdminDao;
import com.fitnesstracker.dao.RoleDao;
import com.fitnesstracker.dao.UserDao;
import com.fitnesstracker.entity.FitnessContent;
import com.fitnesstracker.entity.Role;
import com.fitnesstracker.entity.SystemSetting;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * AdminService
 * Provides administrative control over users, content curation, and system configurations via JDBC DAOs.
 */
@Service
public class AdminService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private RoleDao roleDao;

    @Autowired
    private AdminDao adminDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Retrieve all registered users
     */
    public List<User> getAllUsers() {
        return userDao.findAll();
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
        Role role = roleDao.findByName(roleName)
                .orElseGet(() -> roleDao.save(new Role(roleName)));
        user.setUserRole(role);
        user.setRole(roleName);
        user.setStatus("Active");
        user.setActiveStreak(1);
        user.setWorkoutsCompleted(0);
        user.setTotalCaloriesBurned(0);
        user.setJoinedDate(LocalDate.now().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));

        return userDao.save(user);
    }

    /**
     * Update user details or toggle active/suspended status
     */
    public User updateUser(Long id, User updates) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (updates.getName() != null) user.setName(updates.getName());
        if (updates.getEmail() != null) user.setEmail(updates.getEmail());
        if (updates.getRole() != null) user.setRole(updates.getRole());
        if (updates.getStatus() != null) user.setStatus(updates.getStatus());

        return userDao.update(user);
    }

    /**
     * Delete user account permanently
     */
    public void deleteUser(Long id) {
        User user = userDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        boolean deleted = userDao.delete(user.getId());
        if (!deleted) {
            throw new RuntimeException("Failed to delete user with id: " + id);
        }
    }

    /**
     * Retrieve curated workout content
     */
    public List<FitnessContent> getAllCuratedContent() {
        return adminDao.findAllContent();
    }

    /**
     * Create curated workout content
     */
    public FitnessContent createCuratedContent(FitnessContent content) {
        return adminDao.saveContent(content);
    }

    /**
     * Delete curated content
     */
    public void deleteCuratedContent(Long id) {
        boolean deleted = adminDao.deleteContent(id);
        if (!deleted) {
            throw new ResourceNotFoundException("Content not found with id: " + id);
        }
    }

    /**
     * Retrieve all system settings
     */
    public List<SystemSetting> getSystemSettings() {
        return adminDao.findAllSettings();
    }

    /**
     * Update or insert system setting
     */
    public SystemSetting updateSystemSetting(String key, String value, String description) {
        Optional<SystemSetting> settingOpt = adminDao.findSettingByKey(key);
        SystemSetting setting;
        if (settingOpt.isPresent()) {
            setting = settingOpt.get();
            setting.setSettingValue(value);
            if (description != null) setting.setDescription(description);
        } else {
            setting = new SystemSetting(key, value, description);
        }
        return adminDao.saveSetting(setting);
    }
}
