package com.fitnesstracker.dao;

import com.fitnesstracker.entity.FitnessContent;
import com.fitnesstracker.entity.SystemSetting;
import com.fitnesstracker.jdbc.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * AdminDao
 * JDBC Data Access Object for 'fitness_content' and 'system_settings' tables.
 * Uses PreparedStatement, ResultSet, and try-with-resources.
 */
@Repository
public class AdminDao {

    private static final Logger logger = LoggerFactory.getLogger(AdminDao.class);

    // =========================================================================
    // FITNESS CONTENT OPERATIONS
    // =========================================================================

    public List<FitnessContent> findAllContent() {
        List<FitnessContent> list = new ArrayList<>();
        String sql = "SELECT * FROM fitness_content ORDER BY id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                FitnessContent fc = new FitnessContent();
                fc.setId(rs.getLong("id"));
                fc.setTitle(rs.getString("title"));
                fc.setCategory(rs.getString("category"));
                fc.setLevel(rs.getString("level"));
                fc.setStatus(rs.getString("status"));
                fc.setDescription(rs.getString("description"));
                fc.setContent(rs.getString("content"));
                list.add(fc);
            }
        } catch (SQLException e) {
            logger.error("Error retrieving curated fitness content: {}", e.getMessage());
        }
        return list;
    }

    public FitnessContent saveContent(FitnessContent content) {
        String sql = "INSERT INTO fitness_content (title, category, level, status, description, content) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, content.getTitle());
            ps.setString(2, content.getCategory() != null ? content.getCategory() : "General");
            ps.setString(3, content.getLevel() != null ? content.getLevel() : "All Levels");
            ps.setString(4, content.getStatus() != null ? content.getStatus() : "Published");
            ps.setString(5, content.getDescription());
            ps.setString(6, content.getContent());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    content.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            logger.error("Error saving fitness content: {}", e.getMessage());
            throw new RuntimeException("Database error saving content: " + e.getMessage(), e);
        }
        return content;
    }

    public boolean deleteContent(Long id) {
        String sql = "DELETE FROM fitness_content WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting fitness content id {}: {}", id, e.getMessage());
            return false;
        }
    }

    public long countContent() {
        String sql = "SELECT COUNT(*) FROM fitness_content";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting fitness content: {}", e.getMessage());
        }
        return 0;
    }

    // =========================================================================
    // SYSTEM SETTINGS OPERATIONS
    // =========================================================================

    public List<SystemSetting> findAllSettings() {
        List<SystemSetting> list = new ArrayList<>();
        String sql = "SELECT * FROM system_settings ORDER BY id ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                SystemSetting s = new SystemSetting();
                s.setId(rs.getLong("id"));
                s.setSettingKey(rs.getString("setting_key"));
                s.setSettingValue(rs.getString("setting_value"));
                s.setDescription(rs.getString("description"));
                list.add(s);
            }
        } catch (SQLException e) {
            logger.error("Error retrieving system settings: {}", e.getMessage());
        }
        return list;
    }

    public Optional<SystemSetting> findSettingByKey(String key) {
        String sql = "SELECT * FROM system_settings WHERE setting_key = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, key);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    SystemSetting s = new SystemSetting();
                    s.setId(rs.getLong("id"));
                    s.setSettingKey(rs.getString("setting_key"));
                    s.setSettingValue(rs.getString("setting_value"));
                    s.setDescription(rs.getString("description"));
                    return Optional.of(s);
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding setting key {}: {}", key, e.getMessage());
        }
        return Optional.empty();
    }

    public SystemSetting saveSetting(SystemSetting setting) {
        String sql = "INSERT INTO system_settings (setting_key, setting_value, description) " +
                     "VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = ?, description = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, setting.getSettingKey());
            ps.setString(2, setting.getSettingValue());
            ps.setString(3, setting.getDescription());
            ps.setString(4, setting.getSettingValue());
            ps.setString(5, setting.getDescription());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    setting.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            logger.error("Error saving system setting: {}", e.getMessage());
            throw new RuntimeException("Database error saving system setting: " + e.getMessage(), e);
        }
        return setting;
    }

    public long countSettings() {
        String sql = "SELECT COUNT(*) FROM system_settings";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting system settings: {}", e.getMessage());
        }
        return 0;
    }
}
