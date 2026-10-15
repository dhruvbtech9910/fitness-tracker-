package com.fitnesstracker.dao;

import com.fitnesstracker.entity.FitnessGoal;
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
 * GoalDao
 * JDBC Data Access Object for 'fitness_goals' table.
 * Uses PreparedStatement, ResultSet, and try-with-resources.
 */
@Repository
public class GoalDao {

    private static final Logger logger = LoggerFactory.getLogger(GoalDao.class);

    /**
     * Retrieve all goals ordered by ID descending.
     */
    public List<FitnessGoal> findAll() {
        List<FitnessGoal> goals = new ArrayList<>();
        String sql = "SELECT g.*, u.name as user_name, u.email as user_email " +
                     "FROM fitness_goals g LEFT JOIN users u ON g.user_id = u.id ORDER BY g.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                goals.add(mapResultSetToGoal(rs));
            }
        } catch (SQLException e) {
            logger.error("Error retrieving all goals: {}", e.getMessage());
        }
        return goals;
    }

    /**
     * Retrieve goal by ID.
     */
    public Optional<FitnessGoal> findById(Long id) {
        String sql = "SELECT g.*, u.name as user_name, u.email as user_email " +
                     "FROM fitness_goals g LEFT JOIN users u ON g.user_id = u.id WHERE g.id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToGoal(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding goal by id {}: {}", id, e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Retrieve goals by user ID.
     */
    public List<FitnessGoal> findByUserId(Long userId) {
        List<FitnessGoal> goals = new ArrayList<>();
        String sql = "SELECT g.*, u.name as user_name, u.email as user_email " +
                     "FROM fitness_goals g LEFT JOIN users u ON g.user_id = u.id " +
                     "WHERE g.user_id = ? ORDER BY g.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    goals.add(mapResultSetToGoal(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding goals for user id {}: {}", userId, e.getMessage());
        }
        return goals;
    }

    /**
     * Insert a new fitness goal into database.
     */
    public FitnessGoal save(FitnessGoal goal, Long userId) {
        if (goal.getId() != null) {
            return update(goal);
        }

        String sql = "INSERT INTO fitness_goals (user_id, title, category, current_val, target_val, " +
                     "unit, deadline, progress, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            if (userId != null) {
                ps.setLong(1, userId);
            } else if (goal.getUser() != null && goal.getUser().getId() != null) {
                ps.setLong(1, goal.getUser().getId());
            } else {
                ps.setNull(1, Types.BIGINT);
            }

            ps.setString(2, goal.getTitle());
            ps.setString(3, goal.getCategory() != null ? goal.getCategory() : "Strength");
            ps.setDouble(4, goal.getCurrent() != null ? goal.getCurrent() : 0.0);
            ps.setDouble(5, goal.getTarget() != null ? goal.getTarget() : 100.0);
            ps.setString(6, goal.getUnit() != null ? goal.getUnit() : "kg");
            ps.setString(7, goal.getDeadline());
            ps.setInt(8, goal.getProgress() != null ? goal.getProgress() : 0);
            ps.setString(9, goal.getStatus() != null ? goal.getStatus() : "in-progress");
            ps.setString(10, goal.getNotes());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    goal.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            logger.error("Error saving goal {}: {}", goal.getTitle(), e.getMessage());
            throw new RuntimeException("Database error saving goal: " + e.getMessage(), e);
        }
        return goal;
    }

    /**
     * Update an existing fitness goal.
     */
    public FitnessGoal update(FitnessGoal goal) {
        String sql = "UPDATE fitness_goals SET title = ?, category = ?, current_val = ?, target_val = ?, " +
                     "unit = ?, deadline = ?, progress = ?, status = ?, notes = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, goal.getTitle());
            ps.setString(2, goal.getCategory());
            ps.setDouble(3, goal.getCurrent() != null ? goal.getCurrent() : 0.0);
            ps.setDouble(4, goal.getTarget() != null ? goal.getTarget() : 100.0);
            ps.setString(5, goal.getUnit());
            ps.setString(6, goal.getDeadline());
            ps.setInt(7, goal.getProgress() != null ? goal.getProgress() : 0);
            ps.setString(8, goal.getStatus());
            ps.setString(9, goal.getNotes());
            ps.setLong(10, goal.getId());

            ps.executeUpdate();
        } catch (SQLException e) {
            logger.error("Error updating goal id {}: {}", goal.getId(), e.getMessage());
            throw new RuntimeException("Database error updating goal: " + e.getMessage(), e);
        }
        return goal;
    }

    /**
     * Delete goal by ID.
     */
    public boolean delete(Long id) {
        String sql = "DELETE FROM fitness_goals WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting goal id {}: {}", id, e.getMessage());
            return false;
        }
    }

    /**
     * Count total fitness goals.
     */
    public long count() {
        String sql = "SELECT COUNT(*) FROM fitness_goals";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting goals: {}", e.getMessage());
        }
        return 0;
    }

    private FitnessGoal mapResultSetToGoal(ResultSet rs) throws SQLException {
        FitnessGoal goal = new FitnessGoal();
        goal.setId(rs.getLong("id"));
        goal.setTitle(rs.getString("title"));
        goal.setCategory(rs.getString("category"));
        goal.setCurrent(rs.getDouble("current_val"));
        goal.setTarget(rs.getDouble("target_val"));
        goal.setUnit(rs.getString("unit"));
        goal.setDeadline(rs.getString("deadline"));
        goal.setProgress(rs.getInt("progress"));
        goal.setStatus(rs.getString("status"));
        goal.setNotes(rs.getString("notes"));

        long userId = rs.getLong("user_id");
        if (!rs.wasNull()) {
            User u = new User();
            u.setId(userId);
            try {
                u.setName(rs.getString("user_name"));
                u.setEmail(rs.getString("user_email"));
            } catch (SQLException ignored) {
            }
            goal.setUser(u);
        }

        return goal;
    }
}
