package com.fitnesstracker.dao;

import com.fitnesstracker.entity.Exercise;
import com.fitnesstracker.jdbc.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * ExerciseDao
 * JDBC Data Access Object for 'exercises' table.
 */
@Repository
public class ExerciseDao {

    private static final Logger logger = LoggerFactory.getLogger(ExerciseDao.class);

    public List<Exercise> findAll() {
        List<Exercise> list = new ArrayList<>();
        String sql = "SELECT * FROM exercises ORDER BY id ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Exercise ex = new Exercise();
                ex.setId(rs.getLong("id"));
                ex.setName(rs.getString("name"));
                ex.setCategory(rs.getString("category"));
                ex.setTargetMuscle(rs.getString("target_muscle"));
                ex.setDifficulty(rs.getString("difficulty"));
                ex.setDescription(rs.getString("description"));
                list.add(ex);
            }
        } catch (SQLException e) {
            logger.error("Error retrieving exercises: {}", e.getMessage());
        }
        return list;
    }

    public Optional<Exercise> findById(Long id) {
        String sql = "SELECT * FROM exercises WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Exercise ex = new Exercise();
                    ex.setId(rs.getLong("id"));
                    ex.setName(rs.getString("name"));
                    ex.setCategory(rs.getString("category"));
                    ex.setTargetMuscle(rs.getString("target_muscle"));
                    ex.setDifficulty(rs.getString("difficulty"));
                    ex.setDescription(rs.getString("description"));
                    return Optional.of(ex);
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding exercise by id {}: {}", id, e.getMessage());
        }
        return Optional.empty();
    }

    public Exercise save(Exercise ex) {
        String sql = "INSERT INTO exercises (name, category, target_muscle, difficulty, description) " +
                     "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, ex.getName());
            ps.setString(2, ex.getCategory());
            ps.setString(3, ex.getTargetMuscle());
            ps.setString(4, ex.getDifficulty() != null ? ex.getDifficulty() : "Intermediate");
            ps.setString(5, ex.getDescription());

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    ex.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            logger.error("Error saving exercise {}: {}", ex.getName(), e.getMessage());
            throw new RuntimeException("Database error saving exercise: " + e.getMessage(), e);
        }
        return ex;
    }

    public long count() {
        String sql = "SELECT COUNT(*) FROM exercises";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting exercises: {}", e.getMessage());
        }
        return 0;
    }
}
