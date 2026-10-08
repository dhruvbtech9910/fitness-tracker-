package com.fitnesstracker.controller;

import com.fitnesstracker.entity.Workout;
import com.fitnesstracker.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * WorkoutController
 * REST endpoints for managing workouts and retrieving workout analytics.
 */
@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    /**
     * GET /api/workouts
     * Retrieve all workouts
     */
    @GetMapping
    public ResponseEntity<List<Workout>> getAllWorkouts() {
        List<Workout> workouts = workoutService.getAllWorkouts();
        return ResponseEntity.ok(workouts);
    }

    /**
     * GET /api/workouts/stats
     * Get aggregate workout metrics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getWorkoutStats() {
        Map<String, Object> stats = workoutService.getWorkoutStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/workouts/{id}
     * Retrieve single workout by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Workout> getWorkoutById(@PathVariable Long id) {
        Workout workout = workoutService.getWorkoutById(id);
        return ResponseEntity.ok(workout);
    }

    /**
     * POST /api/workouts
     * Log and save a new workout
     */
    @PostMapping
    public ResponseEntity<Workout> createWorkout(@RequestBody Workout workout, Principal principal, Authentication auth) {
        String userEmail = null;
        if (principal != null) {
            userEmail = principal.getName();
        } else if (auth != null) {
            userEmail = auth.getName();
        }
        Workout created = workoutService.createWorkout(workout, userEmail);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/workouts/{id}
     * Update an existing workout
     */
    @PutMapping("/{id}")
    public ResponseEntity<Workout> updateWorkout(@PathVariable Long id, @RequestBody Workout workout) {
        Workout updated = workoutService.updateWorkout(id, workout);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/workouts/{id}
     * Delete a workout
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Workout deleted successfully"));
    }
}
