package com.fitnesstracker.dao;

import com.fitnesstracker.entity.Challenge;
import com.fitnesstracker.jdbc.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * ChallengeDao
 * JDBC Data Access Object for 'challenges' and 'challenge_participants' tables.
 * Uses PreparedStatement, ResultSet, transactions, and try-with-resources.
 */
@Repository
public class ChallengeDao {

    private static final Logger logger = LoggerFactory.getLogger(ChallengeDao.class);

    /**
     * Retrieve all challenges ordered by newest first.
     */
    public List<Challenge> findAll() {
        List<Challenge> list = new ArrayList<>();
        String sql = "SELECT * FROM challenges ORDER BY id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToChallenge(rs));
            }
        } catch (SQLException e) {
            logger.error("Error retrieving all challenges: {}", e.getMessage());
        }
        return list;
    }

    /**
     * Retrieve challenge by ID.
     */
    public Optional<Challenge> findById(Long id) {
        String sql = "SELECT * FROM challenges WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return Optional.of(mapResultSetToChallenge(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding challenge by id {}: {}", id, e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Insert a new challenge.
     */
    public Challenge save(Challenge c) {
        if (c.getId() != null) {
            return update(c);
        }

        String sql = "INSERT INTO challenges (title, category, reward, description, participants, " +
                     "days_left, duration_days, progress, joined, completed, check_ins, " +
                     "required_check_ins, start_date, end_date, target, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, c.getTitle());
            ps.setString(2, c.getCategory() != null ? c.getCategory() : "Strength");
            ps.setString(3, c.getReward());
            ps.setString(4, c.getDescription());
            ps.setInt(5, c.getParticipants() != null ? c.getParticipants() : 0);
            ps.setInt(6, c.getDaysLeft() != null ? c.getDaysLeft() : 14);
            ps.setInt(7, c.getDurationDays() != null ? c.getDurationDays() : 14);
            ps.setInt(8, c.getProgress() != null ? c.getProgress() : 0);
            ps.setBoolean(9, c.getJoined() != null ? c.getJoined() : false);
            ps.setBoolean(10, c.getCompleted() != null ? c.getCompleted() : false);
            ps.setInt(11, c.getCheckIns() != null ? c.getCheckIns() : 0);
            ps.setInt(12, c.getRequiredCheckIns() != null ? c.getRequiredCheckIns() : 14);
            ps.setString(13, c.getStartDate());
            ps.setString(14, c.getEndDate());
            ps.setString(15, c.getTarget());
            ps.setString(16, c.getStatus() != null ? c.getStatus() : "Active");

            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    c.setId(rs.getLong(1));
                }
            }
        } catch (SQLException e) {
            logger.error("Error saving challenge {}: {}", c.getTitle(), e.getMessage());
            throw new RuntimeException("Database error saving challenge: " + e.getMessage(), e);
        }
        return c;
    }

    /**
     * Update an existing challenge.
     */
    public Challenge update(Challenge c) {
        String sql = "UPDATE challenges SET title = ?, category = ?, reward = ?, description = ?, " +
                     "participants = ?, days_left = ?, duration_days = ?, progress = ?, joined = ?, " +
                     "completed = ?, check_ins = ?, required_check_ins = ?, target = ?, status = ? " +
                     "WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, c.getTitle());
            ps.setString(2, c.getCategory());
            ps.setString(3, c.getReward());
            ps.setString(4, c.getDescription());
            ps.setInt(5, c.getParticipants() != null ? c.getParticipants() : 0);
            ps.setInt(6, c.getDaysLeft() != null ? c.getDaysLeft() : 14);
            ps.setInt(7, c.getDurationDays() != null ? c.getDurationDays() : 14);
            ps.setInt(8, c.getProgress() != null ? c.getProgress() : 0);
            ps.setBoolean(9, c.getJoined() != null ? c.getJoined() : false);
            ps.setBoolean(10, c.getCompleted() != null ? c.getCompleted() : false);
            ps.setInt(11, c.getCheckIns() != null ? c.getCheckIns() : 0);
            ps.setInt(12, c.getRequiredCheckIns() != null ? c.getRequiredCheckIns() : 14);
            ps.setString(13, c.getTarget());
            ps.setString(14, c.getStatus());
            ps.setLong(15, c.getId());

            ps.executeUpdate();
        } catch (SQLException e) {
            logger.error("Error updating challenge id {}: {}", c.getId(), e.getMessage());
            throw new RuntimeException("Database error updating challenge: " + e.getMessage(), e);
        }
        return c;
    }

    /**
     * Join a challenge with user linking inside a JDBC TRANSACTION.
     */
    public Challenge joinChallenge(Long challengeId, Long userId) {
        String updateChallengeSql = "UPDATE challenges SET joined = true, participants = participants + 1 WHERE id = ?";
        String insertParticipantSql = "INSERT INTO challenge_participants (challenge_id, user_id, check_ins, progress, completed, status) " +
                                      "VALUES (?, ?, 0, 0, false, 'Active') " +
                                      "ON DUPLICATE KEY UPDATE status = 'Active'";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement psUpdate = conn.prepareStatement(updateChallengeSql)) {
                psUpdate.setLong(1, challengeId);
                psUpdate.executeUpdate();
            }

            if (userId != null) {
                try (PreparedStatement psPart = conn.prepareStatement(insertParticipantSql)) {
                    psPart.setLong(1, challengeId);
                    psPart.setLong(2, userId);
                    psPart.executeUpdate();
                }
            }

            conn.commit();
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    logger.error("Failed to rollback joinChallenge transaction: {}", ex.getMessage());
                }
            }
            logger.error("Error in joinChallenge transaction: {}", e.getMessage());
            throw new RuntimeException("Database error joining challenge: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    logger.error("Error closing connection: {}", e.getMessage());
                }
            }
        }

        return findById(challengeId).orElse(null);
    }

    /**
     * Daily check-in inside a JDBC TRANSACTION.
     */
    public Challenge checkIn(Long challengeId, Long userId) {
        Challenge c = findById(challengeId)
                .orElseThrow(() -> new RuntimeException("Challenge not found with id: " + challengeId));

        int nextCheckIns = (c.getCheckIns() != null ? c.getCheckIns() : 0) + 1;
        int required = c.getRequiredCheckIns() != null ? c.getRequiredCheckIns() : 14;
        int computedProgress = Math.min((int) Math.round(((double) nextCheckIns / required) * 100), 100);
        boolean isCompleted = computedProgress >= 100;

        String updateChallengeSql = "UPDATE challenges SET check_ins = ?, progress = ?, completed = ? WHERE id = ?";
        String updateParticipantSql = "UPDATE challenge_participants SET check_ins = ?, progress = ?, completed = ? " +
                                      "WHERE challenge_id = ? AND user_id = ?";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement psC = conn.prepareStatement(updateChallengeSql)) {
                psC.setInt(1, nextCheckIns);
                psC.setInt(2, computedProgress);
                psC.setBoolean(3, isCompleted);
                psC.setLong(4, challengeId);
                psC.executeUpdate();
            }

            if (userId != null) {
                try (PreparedStatement psP = conn.prepareStatement(updateParticipantSql)) {
                    psP.setInt(1, nextCheckIns);
                    psP.setInt(2, computedProgress);
                    psP.setBoolean(3, isCompleted);
                    psP.setLong(4, challengeId);
                    psP.setLong(5, userId);
                    psP.executeUpdate();
                }
            }

            conn.commit();
        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    logger.error("Failed to rollback checkIn transaction: {}", ex.getMessage());
                }
            }
            logger.error("Error in checkIn transaction: {}", e.getMessage());
            throw new RuntimeException("Database error recording challenge check-in: " + e.getMessage(), e);
        } finally {
            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    logger.error("Error closing connection: {}", e.getMessage());
                }
            }
        }

        return findById(challengeId).orElse(null);
    }

    /**
     * Delete challenge by ID.
     */
    public boolean delete(Long id) {
        String sql = "DELETE FROM challenges WHERE id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error deleting challenge id {}: {}", id, e.getMessage());
            return false;
        }
    }

    /**
     * Count total challenges.
     */
    public long count() {
        String sql = "SELECT COUNT(*) FROM challenges";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting challenges: {}", e.getMessage());
        }
        return 0;
    }

    private Challenge mapResultSetToChallenge(ResultSet rs) throws SQLException {
        Challenge c = new Challenge();
        c.setId(rs.getLong("id"));
        c.setTitle(rs.getString("title"));
        c.setCategory(rs.getString("category"));
        c.setReward(rs.getString("reward"));
        c.setDescription(rs.getString("description"));
        c.setParticipants(rs.getInt("participants"));
        c.setDaysLeft(rs.getInt("days_left"));
        c.setDurationDays(rs.getInt("duration_days"));
        c.setProgress(rs.getInt("progress"));
        c.setJoined(rs.getBoolean("joined"));
        c.setCompleted(rs.getBoolean("completed"));
        c.setCheckIns(rs.getInt("check_ins"));
        c.setRequiredCheckIns(rs.getInt("required_check_ins"));
        c.setTarget(rs.getString("target"));
        c.setStatus(rs.getString("status"));
        return c;
    }
}
