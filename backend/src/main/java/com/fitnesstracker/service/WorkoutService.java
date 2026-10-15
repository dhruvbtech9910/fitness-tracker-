package com.fitnesstracker.service;

import com.fitnesstracker.dao.UserDao;
import com.fitnesstracker.dao.WorkoutDao;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.entity.Workout;
import com.fitnesstracker.entity.WorkoutExercise;
import com.fitnesstracker.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * WorkoutService
 * Business logic for logging, retrieving, and calculating statistics for workouts via JDBC WorkoutDao.
 */
@Service
public class WorkoutService {

    @Autowired
    private WorkoutDao workoutDao;

    @Autowired
    private UserDao userDao;

    /**
     * Retrieve all workouts ordered by newest first
     */
    public List<Workout> getAllWorkouts() {
        return workoutDao.findAll();
    }

    /**
     * Retrieve single workout by ID
     */
    public Workout getWorkoutById(Long id) {
        return workoutDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found with id: " + id));
    }

    /**
     * Create and log a new workout using JDBC transaction
     */
    public Workout createWorkout(Workout workout, String userEmail) {
        Long userId = null;

        // Link to user if logged in
        if (userEmail != null) {
            Optional<User> userOpt = userDao.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                userId = user.getId();
                workout.setUser(user);

                // Increment user workout tally and burned calories
                int currentWorkouts = user.getWorkoutsCompleted() != null ? user.getWorkoutsCompleted() : 0;
                user.setWorkoutsCompleted(currentWorkouts + 1);

                int calories = workout.getCaloriesBurned() != null ? workout.getCaloriesBurned() : 400;
                int currentTotalCal = user.getTotalCaloriesBurned() != null ? user.getTotalCaloriesBurned() : 0;
                user.setTotalCaloriesBurned(currentTotalCal + calories);

                userDao.update(user);
            }
        }

        // Set default date if null
        if (workout.getDate() == null) {
            workout.setDate(LocalDateTime.now().toString());
        }

        // Calculate exercisesCount
        if (workout.getExercises() != null && !workout.getExercises().isEmpty()) {
            workout.setExercisesCount(workout.getExercises().size());
            for (WorkoutExercise ex : workout.getExercises()) {
                ex.setWorkout(workout);
            }
        } else if (workout.getExercisesCount() == null) {
            workout.setExercisesCount(4);
        }

        return workoutDao.create(workout, userId);
    }

    /**
     * Update an existing workout
     */
    public Workout updateWorkout(Long id, Workout updates) {
        Workout workout = getWorkoutById(id);

        if (updates.getTitle() != null) workout.setTitle(updates.getTitle());
        if (updates.getCategory() != null) workout.setCategory(updates.getCategory());
        if (updates.getDuration() != null) workout.setDuration(updates.getDuration());
        if (updates.getDurationMinutes() != null) workout.setDurationMinutes(updates.getDurationMinutes());
        if (updates.getCalories() != null) workout.setCalories(updates.getCalories());
        if (updates.getCaloriesBurned() != null) workout.setCaloriesBurned(updates.getCaloriesBurned());
        if (updates.getDifficulty() != null) workout.setDifficulty(updates.getDifficulty());
        if (updates.getTargetMuscles() != null) workout.setTargetMuscles(updates.getTargetMuscles());
        if (updates.getDescription() != null) workout.setDescription(updates.getDescription());

        return workoutDao.update(workout);
    }

    /**
     * Delete workout by ID
     */
    public void deleteWorkout(Long id) {
        Workout workout = getWorkoutById(id);
        boolean deleted = workoutDao.delete(workout.getId());
        if (!deleted) {
            throw new RuntimeException("Failed to delete workout with id: " + id);
        }
    }

    /**
     * Calculate summary metrics across all logged workouts
     */
    public Map<String, Object> getWorkoutStats() {
        List<Workout> workouts = workoutDao.findAll();
        int totalWorkouts = workouts.size();
        int totalMinutes = 0;
        int totalCalories = 0;

        for (Workout w : workouts) {
            int minutes = w.getDurationMinutes() != null ? w.getDurationMinutes() : 45;
            int cals = w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 450;
            totalMinutes += minutes;
            totalCalories += cals;
        }

        int avgCalories = totalWorkouts > 0 ? Math.round((float) totalCalories / totalWorkouts) : 0;
        int avgDuration = totalWorkouts > 0 ? Math.round((float) totalMinutes / totalWorkouts) : 0;

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalWorkouts", totalWorkouts);
        stats.put("totalMinutes", totalMinutes);
        stats.put("totalCalories", totalCalories);
        stats.put("averageCaloriesPerWorkout", avgCalories);
        stats.put("averageDuration", avgDuration);

        return stats;
    }
}
