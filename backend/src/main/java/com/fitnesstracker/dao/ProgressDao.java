package com.fitnesstracker.dao;

import com.fitnesstracker.entity.Progress;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.jdbc.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * ProgressDao
 * JDBC Data Access Object for 'progress' table.
 * Uses PreparedStatement, ResultSet, and try-with-resources.
 */
@Repository
public class ProgressDao {

    private static final Logger logger = LoggerFactory.getLogger(ProgressDao.class);

    /**
     * Retrieve all progress records ordered by newest first.
     */
    public List<Progress> findAll() {
        List<Progress> list = new ArrayList<>();
        String sql = "SELECT p.*, u.name as user_name, u.email as user_email " +
                     "FROM progress p LEFT JOIN users u ON p.user_id = u.id ORDER BY p.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToProgress(rs));
            }
        } catch (SQLException e) {
            logger.error("Error retrieving all progress records: {}", e.getMessage());
        }
        return list;
    }

    /**
     * Retrieve progress records for a specific user.
     */
    public List<Progress> findByUserId(Long userId) {
        List<Progress> list = new ArrayList<>();
        String sql = "SELECT p.*, u.name as user_name, u.email as user_email " +
                     "FROM progress p LEFT JOIN users u ON p.user_id = u.id " +
                     "WHERE p.user_id = ? ORDER BY p.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapResultSetToProgress(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding progress for user id {}: {}", userId, e.getMessage());
        }
        return list;
    }

    /**
     * Retrieve progress by ID.
     */
    public Optional<Progress> findById(Long id) {
        String sql = "SELECT p.*, u.name as user_name, u.email as user_email " +
                     "FROM progress p LEFT JOIN users u ON p.user_id = u.id WHERE p.id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToProgress(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding progress by id {}: {}", id, e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Insert a new progress record.
     */
    public Progress save(Progress progress, Long userId) {
        String sql = "INSERT INTO progress (user_id, exercise, weight, reps, body_fat, workout_count, " +
                     "calories_burned, recorded_date, badge, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            if (userId != null) {
                ps.setLong(1, userId);
            } else if (progress.getUser() != null && progress.getUser().getId() != null) {
                ps.setLong(1, progress.getUser().getId());
            } else {
                ps.setNull(1, Types.BIGINT);
            }

            ps.setString(2, progress.getExercise());
            ps.setString(3, progress.getWeight());
            ps.setInt(4, progress.getReps() != null ? progress.getReps() : 1);

            if (progress.getBodyFat() != null) {
                ps.setDouble(5, progress.getBodyFat());
            } else {
                ps.setNull(5, Types.DOUBLE);
            }

            ps.setInt(6, progress.getWorkoutCount() != null ? progress.getWorkoutCount() : 0);
            ps.setInt(7, progress.getCaloriesBurned() != null ? progress.getCaloriesBurned() : 0);
            ps.setString(8, progress.getRecordedDate() != null ? progress.getRecordedDate() : "Today");
            ps.setString(9, progress.getBadge() != null ? progress.getBadge() : "Gold");
            ps.setString(10, progress.getNotes());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    progress.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            logger.error("Error saving progress {}: {}", progress.getExercise(), e.getMessage());
            throw new RuntimeException("Database error saving progress: " + e.getMessage(), e);
        }
        return progress;
    }

    /**
     * Delete progress record by ID.
     */
    public boolean delete(Long id) {
        String sql = "DELETE FROM progress WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting progress id {}: {}", id, e.getMessage());
            return false;
        }
    }

    /**
     * Count total progress records.
     */
    public long count() {
        String sql = "SELECT COUNT(*) FROM progress";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting progress records: {}", e.getMessage());
        }
        return 0;
    }

    private Progress mapResultSetToProgress(ResultSet rs) throws SQLException {
        Progress p = new Progress();
        p.setId(rs.getLong("id"));
        p.setExercise(rs.getString("exercise"));
        p.setWeight(rs.getString("weight"));
        p.setReps(rs.getInt("reps"));

        double bf = rs.getDouble("body_fat");
        if (!rs.wasNull()) {
            p.setBodyFat(bf);
        }

        p.setWorkoutCount(rs.getInt("workout_count"));
        p.setCaloriesBurned(rs.getInt("calories_burned"));
        p.setRecordedDate(rs.getString("recorded_date"));
        p.setBadge(rs.getString("badge"));
        p.setNotes(rs.getString("notes"));

        long userId = rs.getLong("user_id");
        if (!rs.wasNull()) {
            User u = new User();
            u.setId(userId);
            try {
                u.setName(rs.getString("user_name"));
                u.setEmail(rs.getString("user_email"));
            } catch (SQLException ignored) {
            }
            p.setUser(u);
        }

        return p;
    }
}
