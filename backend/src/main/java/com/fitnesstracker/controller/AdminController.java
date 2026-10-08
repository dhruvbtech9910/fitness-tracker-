package com.fitnesstracker.controller;

import com.fitnesstracker.entity.FitnessContent;
import com.fitnesstracker.entity.SystemSetting;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminController
 * Endpoints reserved for administrative telemetry, user management, and curated content moderation.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * GET /api/admin/users
     * Retrieve all registered users
     */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    /**
     * POST /api/admin/users
     * Admin creates a new user
     */
    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User created = adminService.createUser(user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/admin/users/{id}
     * Admin updates user status or profile details
     */
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updated = adminService.updateUser(id, user);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/admin/users/{id}
     * Admin permanently removes a user account
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "User successfully deleted"));
    }

    /**
     * GET /api/admin/content
     * Curated content catalogue
     */
    @GetMapping("/content")
    public ResponseEntity<List<FitnessContent>> getContent() {
        List<FitnessContent> content = adminService.getAllCuratedContent();
        return ResponseEntity.ok(content);
    }

    /**
     * POST /api/admin/content
     * Create curated workout content
     */
    @PostMapping("/content")
    public ResponseEntity<FitnessContent> createContent(@RequestBody FitnessContent content) {
        FitnessContent created = adminService.createCuratedContent(content);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * DELETE /api/admin/content/{id}
     * Delete curated content
     */
    @DeleteMapping("/content/{id}")
    public ResponseEntity<Map<String, Object>> deleteContent(@PathVariable Long id) {
        adminService.deleteCuratedContent(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Content removed"));
    }

    /**
     * GET /api/admin/settings
     * Retrieve system settings
     */
    @GetMapping("/settings")
    public ResponseEntity<List<SystemSetting>> getSettings() {
        List<SystemSetting> settings = adminService.getSystemSettings();
        return ResponseEntity.ok(settings);
    }

    /**
     * PUT /api/admin/settings
     * Update a system setting
     */
    @PutMapping("/settings")
    public ResponseEntity<SystemSetting> updateSetting(@RequestBody Map<String, String> payload) {
        String key = payload.get("key");
        String value = payload.get("value");
        String desc = payload.get("description");
        SystemSetting updated = adminService.updateSystemSetting(key, value, desc);
        return ResponseEntity.ok(updated);
    }
}
