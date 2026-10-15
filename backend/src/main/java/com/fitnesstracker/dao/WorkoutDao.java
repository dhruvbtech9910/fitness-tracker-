package com.fitnesstracker.dao;

import com.fitnesstracker.entity.User;
import com.fitnesstracker.entity.Workout;
import com.fitnesstracker.entity.WorkoutExercise;
import com.fitnesstracker.jdbc.DatabaseConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.*;

/**
 * WorkoutDao
 * JDBC Data Access Object for 'workouts' and 'workout_exercises' tables.
 * Uses PreparedStatement, ResultSet, transactions, and try-with-resources.
 */
@Repository
public class WorkoutDao {

    private static final Logger logger = LoggerFactory.getLogger(WorkoutDao.class);

    /**
     * Retrieve all workouts ordered by newest first.
     */
    public List<Workout> findAll() {
        List<Workout> workouts = new ArrayList<>();
        String sql = "SELECT w.*, u.name as user_name, u.email as user_email " +
                     "FROM workouts w LEFT JOIN users u ON w.user_id = u.id ORDER BY w.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Workout w = mapResultSetToWorkout(rs);
                workouts.add(w);
            }
        } catch (SQLException e) {
            logger.error("Error retrieving all workouts: {}", e.getMessage());
        }

        // Fetch exercises for each workout
        for (Workout w : workouts) {
            w.setExercises(getWorkoutExercises(w.getId()));
        }

        return workouts;
    }

    /**
     * Retrieve single workout by ID.
     */
    public Optional<Workout> findById(Long id) {
        String sql = "SELECT w.*, u.name as user_name, u.email as user_email " +
                     "FROM workouts w LEFT JOIN users u ON w.user_id = u.id WHERE w.id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Workout w = mapResultSetToWorkout(rs);
                    w.setExercises(getWorkoutExercises(w.getId()));
                    return Optional.of(w);
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding workout by id {}: {}", id, e.getMessage());
        }
        return Optional.empty();
    }

    /**
     * Retrieve all workouts belonging to a specific user.
     */
    public List<Workout> findByUserId(Long userId) {
        List<Workout> workouts = new ArrayList<>();
        String sql = "SELECT w.*, u.name as user_name, u.email as user_email " +
                     "FROM workouts w LEFT JOIN users u ON w.user_id = u.id " +
                     "WHERE w.user_id = ? ORDER BY w.id DESC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Workout w = mapResultSetToWorkout(rs);
                    workouts.add(w);
                }
            }
        } catch (SQLException e) {
            logger.error("Error finding workouts for user id {}: {}", userId, e.getMessage());
        }

        for (Workout w : workouts) {
            w.setExercises(getWorkoutExercises(w.getId()));
        }

        return workouts;
    }

    /**
     * Create a new workout with exercises using a JDBC TRANSACTION.
     */
    public Workout create(Workout workout, Long userId) {
        String insertWorkoutSql = "INSERT INTO workouts (user_id, title, category, duration, duration_minutes, " +
                                  "calories, calories_burned, difficulty, exercises_count, target_muscles, " +
                                  "date, is_popular, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        String insertExerciseSql = "INSERT INTO workout_exercises (workout_id, exercise_id, name, sets, reps, weight, duration, notes, completed) " +
                                   "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            // Start JDBC Transaction
            conn.setAutoCommit(false);

            try (PreparedStatement psWorkout = conn.prepareStatement(insertWorkoutSql, Statement.RETURN_GENERATED_KEYS)) {
                if (userId != null) {
                    psWorkout.setLong(1, userId);
                } else if (workout.getUser() != null && workout.getUser().getId() != null) {
                    psWorkout.setLong(1, workout.getUser().getId());
                } else {
                    psWorkout.setNull(1, Types.BIGINT);
                }

                psWorkout.setString(2, workout.getTitle());
                psWorkout.setString(3, workout.getCategory() != null ? workout.getCategory() : "Strength");
                psWorkout.setString(4, workout.getDuration() != null ? workout.getDuration() : "45 Min");
                psWorkout.setInt(5, workout.getDurationMinutes() != null ? workout.getDurationMinutes() : 45);
                psWorkout.setString(6, workout.getCalories() != null ? workout.getCalories() : "400 kcal");
                psWorkout.setInt(7, workout.getCaloriesBurned() != null ? workout.getCaloriesBurned() : 400);
                psWorkout.setString(8, workout.getDifficulty() != null ? workout.getDifficulty() : "Intermediate");
                psWorkout.setInt(9, workout.getExercisesCount() != null ? workout.getExercisesCount() : 0);
                psWorkout.setString(10, workout.getTargetMuscles());
                psWorkout.setString(11, workout.getDate());
                psWorkout.setBoolean(12, workout.getIsPopular() != null ? workout.getIsPopular() : false);
                psWorkout.setString(13, workout.getDescription());

                psWorkout.executeUpdate();

                try (ResultSet rsKeys = psWorkout.getGeneratedKeys()) {
                    if (rsKeys.next()) {
                        workout.setId(rsKeys.getLong(1));
                    }
                }
            }

            // Insert associated exercises in the same transaction
            if (workout.getExercises() != null && !workout.getExercises().isEmpty()) {
                try (PreparedStatement psEx = conn.prepareStatement(insertExerciseSql, Statement.RETURN_GENERATED_KEYS)) {
                    for (WorkoutExercise ex : workout.getExercises()) {
                        psEx.setLong(1, workout.getId());
                        psEx.setNull(2, Types.BIGINT); // exercise_id can be null or mapped
                        psEx.setString(3, ex.getName());
                        psEx.setInt(4, ex.getSets() != null ? ex.getSets() : 3);
                        psEx.setInt(5, ex.getReps() != null ? ex.getReps() : 10);
                        psEx.setDouble(6, ex.getWeight() != null ? ex.getWeight() : 0.0);
                        psEx.setInt(7, ex.getDuration() != null ? ex.getDuration() : 0);
                        psEx.setString(8, ex.getNotes());
                        psEx.setBoolean(9, ex.getCompleted() != null ? ex.getCompleted() : true);
                        psEx.executeUpdate();

                        try (ResultSet rsExKeys = psEx.getGeneratedKeys()) {
                            if (rsExKeys.next()) {
                                ex.setId(rsExKeys.getLong(1));
                            }
                        }
                        ex.setWorkout(workout);
                    }
                }
            }

            // Commit transaction
            conn.commit();
            logger.info("Successfully created workout id {} within transaction", workout.getId());

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                    logger.warn("Transaction rolled back for workout creation due to error: {}", e.getMessage());
                } catch (SQLException ex) {
                    logger.error("Failed to rollback transaction: {}", ex.getMessage());
                }
            }
            throw new RuntimeException("Database error creating workout: " + e.getMessage(), e);
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

        return workout;
    }

    /**
     * Update an existing workout.
     */
    public Workout update(Workout workout) {
        String sql = "UPDATE workouts SET title = ?, category = ?, duration = ?, duration_minutes = ?, " +
                     "calories = ?, calories_burned = ?, difficulty = ?, exercises_count = ?, " +
                     "target_muscles = ?, description = ?, is_popular = ? WHERE id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, workout.getTitle());
            ps.setString(2, workout.getCategory());
            ps.setString(3, workout.getDuration());
            ps.setInt(4, workout.getDurationMinutes() != null ? workout.getDurationMinutes() : 45);
            ps.setString(5, workout.getCalories());
            ps.setInt(6, workout.getCaloriesBurned() != null ? workout.getCaloriesBurned() : 400);
            ps.setString(7, workout.getDifficulty());
            ps.setInt(8, workout.getExercisesCount() != null ? workout.getExercisesCount() : 0);
            ps.setString(9, workout.getTargetMuscles());
            ps.setString(10, workout.getDescription());
            ps.setBoolean(11, workout.getIsPopular() != null ? workout.getIsPopular() : false);
            ps.setLong(12, workout.getId());

            ps.executeUpdate();
        } catch (SQLException e) {
            logger.error("Error updating workout id {}: {}", workout.getId(), e.getMessage());
            throw new RuntimeException("Database error updating workout: " + e.getMessage(), e);
        }
        return workout;
    }

    /**
     * Delete workout by ID using transaction (removes exercises then workout).
     */
    public boolean delete(Long id) {
        String deleteExercisesSql = "DELETE FROM workout_exercises WHERE workout_id = ?";
        String deleteWorkoutSql = "DELETE FROM workouts WHERE id = ?";

        Connection conn = null;
        try {
            conn = DatabaseConnection.getConnection();
            conn.setAutoCommit(false);

            try (PreparedStatement psEx = conn.prepareStatement(deleteExercisesSql)) {
                psEx.setLong(1, id);
                psEx.executeUpdate();
            }

            boolean deleted;
            try (PreparedStatement psW = conn.prepareStatement(deleteWorkoutSql)) {
                psW.setLong(1, id);
                deleted = psW.executeUpdate() > 0;
            }

            conn.commit();
            return deleted;

        } catch (SQLException e) {
            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    logger.error("Rollback failed: {}", ex.getMessage());
                }
            }
            logger.error("Error deleting workout id {}: {}", id, e.getMessage());
            return false;
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
    }

    /**
     * Get exercises for a specific workout.
     */
    public List<WorkoutExercise> getWorkoutExercises(Long workoutId) {
        List<WorkoutExercise> list = new ArrayList<>();
        String sql = "SELECT * FROM workout_exercises WHERE workout_id = ? ORDER BY id ASC";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, workoutId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    WorkoutExercise ex = new WorkoutExercise();
                    ex.setId(rs.getLong("id"));
                    ex.setName(rs.getString("name"));
                    ex.setSets(rs.getInt("sets"));
                    ex.setReps(rs.getInt("reps"));
                    ex.setWeight(rs.getDouble("weight"));
                    ex.setDuration(rs.getInt("duration"));
                    ex.setNotes(rs.getString("notes"));
                    ex.setCompleted(rs.getBoolean("completed"));
                    list.add(ex);
                }
            }
        } catch (SQLException e) {
            logger.error("Error retrieving exercises for workout {}: {}", workoutId, e.getMessage());
        }
        return list;
    }

    /**
     * Get aggregate workout metrics using SQL aggregation functions.
     */
    public Map<String, Object> getWorkoutStats() {
        Map<String, Object> stats = new HashMap<>();
        String sql = "SELECT COUNT(*) as total_workouts, " +
                     "COALESCE(SUM(duration_minutes), 0) as total_duration, " +
                     "COALESCE(SUM(calories_burned), 0) as total_calories, " +
                     "COALESCE(AVG(calories_burned), 0) as avg_calories " +
                     "FROM workouts";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                stats.put("totalWorkouts", rs.getInt("total_workouts"));
                stats.put("totalDurationMinutes", rs.getInt("total_duration"));
                stats.put("totalCaloriesBurned", rs.getInt("total_calories"));
                stats.put("averageCaloriesBurned", Math.round(rs.getDouble("avg_calories")));
            }
        } catch (SQLException e) {
            logger.error("Error retrieving workout stats: {}", e.getMessage());
        }
        return stats;
    }

    /**
     * Count total workouts.
     */
    public long count() {
        String sql = "SELECT COUNT(*) FROM workouts";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getLong(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting workouts: {}", e.getMessage());
        }
        return 0;
    }

    private Workout mapResultSetToWorkout(ResultSet rs) throws SQLException {
        Workout w = new Workout();
        w.setId(rs.getLong("id"));
        w.setTitle(rs.getString("title"));
        w.setCategory(rs.getString("category"));
        w.setDuration(rs.getString("duration"));
        w.setDurationMinutes(rs.getInt("duration_minutes"));
        w.setCalories(rs.getString("calories"));
        w.setCaloriesBurned(rs.getInt("calories_burned"));
        w.setDifficulty(rs.getString("difficulty"));
        w.setExercisesCount(rs.getInt("exercises_count"));
        w.setTargetMuscles(rs.getString("target_muscles"));
        w.setDate(rs.getString("date"));
        w.setIsPopular(rs.getBoolean("is_popular"));
        w.setDescription(rs.getString("description"));

        long userId = rs.getLong("user_id");
        if (!rs.wasNull()) {
            User u = new User();
            u.setId(userId);
            try {
                u.setName(rs.getString("user_name"));
                u.setEmail(rs.getString("user_email"));
            } catch (SQLException ignored) {
            }
            w.setUser(u);
        }

        return w;
    }
}
