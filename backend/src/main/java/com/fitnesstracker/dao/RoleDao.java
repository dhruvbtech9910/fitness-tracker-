package com.fitnesstracker.dao;

import com.fitnesstracker.entity.Role;
import com.fitnesstracker.jdbc.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * RoleDao
 * JDBC Data Access Object for 'roles' table.
 */
@Repository
public class RoleDao {

    private static final Logger logger = LoggerFactory.getLogger(RoleDao.class);

    /**
     * Find role by name
     */
    public Optional<Role> findByName(String name) {
        String sql = "SELECT id, name, description FROM roles WHERE name = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToRole(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding role by name {}: {}", name, e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Find role by ID
     */
    public Optional<Role> findById(Long id) {
        String sql = "SELECT id, name, description FROM roles WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToRole(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding role by id {}: {}", id, e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Retrieve all roles
     */
    public List<Role> findAll() {
        List<Role> roles = new ArrayList<>();
        String sql = "SELECT id, name, description FROM roles ORDER BY id ASC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                roles.add(mapResultSetToRole(rs));
            }
        } catch (SQLException e) {
            logger.error("Error retrieving all roles: {}", e.getMessage());
        }
        return roles;
    }

    /**
     * Save a new role
     */
    public Role save(Role role) {
        String sql = "INSERT INTO roles (name, description) VALUES (?, ?)";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, role.getName());
            ps.setString(2, role.getDescription());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    role.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            logger.error("Error saving role {}: {}", role.getName(), e.getMessage());
        }
        return role;
    }

    /**
     * Count total roles
     */
    public long count() {
        String sql = "SELECT COUNT(*) FROM roles";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting roles: {}", e.getMessage());
        }
        return 0;
    }

    private Role mapResultSetToRole(ResultSet rs) throws SQLException {
        Role role = new Role();
        role.setId(rs.getLong("id"));
        role.setName(rs.getString("name"));
        role.setDescription(rs.getString("description"));
        return role;
    }
}
