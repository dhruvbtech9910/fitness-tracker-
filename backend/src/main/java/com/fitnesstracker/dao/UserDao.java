package com.fitnesstracker.dao;

import com.fitnesstracker.entity.Role;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.jdbc.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * UserDao
 * JDBC Data Access Object for 'users' table.
 * Uses PreparedStatements, ResultSets, and try-with-resources.
 */
@Repository
public class UserDao {

    private static final Logger logger = LoggerFactory.getLogger(UserDao.class);

    @Autowired(required = false)
    private RoleDao roleDao;

    /**
     * Find a user by their unique email address.
     */
    public Optional<User> findByEmail(String email) {
        String sql = "SELECT u.*, r.name as role_name_tbl, r.description as role_desc " +
                     "FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToUser(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding user by email {}: {}", email, e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Find a user by their ID.
     */
    public Optional<User> findById(Long id) {
        String sql = "SELECT u.*, r.name as role_name_tbl, r.description as role_desc " +
                     "FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToUser(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding user by id {}: {}", id, e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Check if an email is already registered.
     */
    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            logger.error("Error checking existence of email {}: {}", email, e.getMessage());
        }
        return false;
    }

    /**
     * Retrieve all registered users.
     */
    public List<User> findAll() {
        List<User> users = new ArrayList<>();
        String sql = "SELECT u.*, r.name as role_name_tbl, r.description as role_desc " +
                     "FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.id ASC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }
        } catch (SQLException e) {
            logger.error("Error retrieving all users: {}", e.getMessage());
        }
        return users;
    }

    /**
     * Insert a new user into the database.
     */
    public User save(User user) {
        if (user.getId() != null) {
            return update(user);
        }

        String sql = "INSERT INTO users (name, email, password, role_id, role, avatar, age, gender, height, " +
                     "weight, target_weight, fitness_goal, activity_level, status, active_streak, " +
                     "workouts_completed, total_calories_burned, membership_tier, joined_date) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            Long roleId = user.getUserRole() != null ? user.getUserRole().getId() : null;

            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            if (roleId != null) {
                ps.setLong(4, roleId);
            } else {
                ps.setNull(4, Types.BIGINT);
            }
            ps.setString(5, user.getRole() != null ? user.getRole() : "Athlete");
            ps.setString(6, user.getAvatar());
            ps.setInt(7, user.getAge() != null ? user.getAge() : 25);
            ps.setString(8, user.getGender() != null ? user.getGender() : "Not Specified");
            ps.setDouble(9, user.getHeight() != null ? user.getHeight() : 175.0);
            ps.setDouble(10, user.getWeight() != null ? user.getWeight() : 75.0);
            ps.setDouble(11, user.getTargetWeight() != null ? user.getTargetWeight() : 75.0);
            ps.setString(12, user.getFitnessGoal() != null ? user.getFitnessGoal() : "General Fitness");
            ps.setString(13, user.getActivityLevel() != null ? user.getActivityLevel() : "Moderately Active");
            ps.setString(14, user.getStatus() != null ? user.getStatus() : "Active");
            ps.setInt(15, user.getActiveStreak() != null ? user.getActiveStreak() : 1);
            ps.setInt(16, user.getWorkoutsCompleted() != null ? user.getWorkoutsCompleted() : 0);
            ps.setInt(17, user.getTotalCaloriesBurned() != null ? user.getTotalCaloriesBurned() : 0);
            ps.setString(18, user.getMembershipTier() != null ? user.getMembershipTier() : "Pro Athlete");
            ps.setString(19, user.getJoinedDate());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    user.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            logger.error("Error saving user {}: {}", user.getEmail(), e.getMessage());
            throw new RuntimeException("Database error saving user: " + e.getMessage(), e);
        }
        return user;
    }

    /**
     * Update existing user record.
     */
    public User update(User user) {
        String sql = "UPDATE users SET name = ?, email = ?, password = ?, role_id = ?, role = ?, " +
                     "avatar = ?, age = ?, gender = ?, height = ?, weight = ?, target_weight = ?, " +
                     "fitness_goal = ?, activity_level = ?, status = ?, active_streak = ?, " +
                     "workouts_completed = ?, total_calories_burned = ?, membership_tier = ? " +
                     "WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            Long roleId = user.getUserRole() != null ? user.getUserRole().getId() : null;

            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            if (roleId != null) {
                ps.setLong(4, roleId);
            } else {
                ps.setNull(4, Types.BIGINT);
            }
            ps.setString(5, user.getRole());
            ps.setString(6, user.getAvatar());
            ps.setInt(7, user.getAge() != null ? user.getAge() : 25);
            ps.setString(8, user.getGender() != null ? user.getGender() : "Not Specified");
            ps.setDouble(9, user.getHeight() != null ? user.getHeight() : 175.0);
            ps.setDouble(10, user.getWeight() != null ? user.getWeight() : 75.0);
            ps.setDouble(11, user.getTargetWeight() != null ? user.getTargetWeight() : 75.0);
            ps.setString(12, user.getFitnessGoal());
            ps.setString(13, user.getActivityLevel());
            ps.setString(14, user.getStatus());
            ps.setInt(15, user.getActiveStreak() != null ? user.getActiveStreak() : 1);
            ps.setInt(16, user.getWorkoutsCompleted() != null ? user.getWorkoutsCompleted() : 0);
            ps.setInt(17, user.getTotalCaloriesBurned() != null ? user.getTotalCaloriesBurned() : 0);
            ps.setString(18, user.getMembershipTier());
            ps.setLong(19, user.getId());

            ps.executeUpdate();
        } catch (SQLException e) {
            logger.error("Error updating user id {}: {}", user.getId(), e.getMessage());
            throw new RuntimeException("Database error updating user: " + e.getMessage(), e);
        }
        return user;
    }

    /**
     * Delete user by ID.
     */
    public boolean delete(Long id) {
        String sql = "DELETE FROM users WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting user id {}: {}", id, e.getMessage());
            return false;
        }
    }

    /**
     * Count total registered users.
     */
    public long count() {
        String sql = "SELECT COUNT(*) FROM users";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting users: {}", e.getMessage());
        }
        return 0;
    }

    private User mapResultSetToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setRole(rs.getString("role"));
        user.setAvatar(rs.getString("avatar"));
        user.setAge(rs.getInt("age"));
        user.setGender(rs.getString("gender"));
        user.setHeight(rs.getDouble("height"));
        user.setWeight(rs.getDouble("weight"));
        user.setTargetWeight(rs.getDouble("target_weight"));
        user.setFitnessGoal(rs.getString("fitness_goal"));
        user.setActivityLevel(rs.getString("activity_level"));
        user.setStatus(rs.getString("status"));
        user.setActiveStreak(rs.getInt("active_streak"));
        user.setWorkoutsCompleted(rs.getInt("workouts_completed"));
        user.setTotalCaloriesBurned(rs.getInt("total_calories_burned"));
        user.setMembershipTier(rs.getString("membership_tier"));
        user.setJoinedDate(rs.getString("joined_date"));

        long roleId = rs.getLong("role_id");
        if (!rs.wasNull()) {
            Role role = new Role();
            role.setId(roleId);
            try {
                role.setName(rs.getString("role_name_tbl"));
                role.setDescription(rs.getString("role_desc"));
            } catch (SQLException ignored) {
            }
            user.setUserRole(role);
        }

        return user;
    }
}
