package com.fitnesstracker.repository;

import com.fitnesstracker.entity.WorkoutExercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * WorkoutExerciseRepository
 * Provides database access methods for exercises nested inside workouts.
 */
@Repository
public interface WorkoutExerciseRepository extends JpaRepository<WorkoutExercise, Long> {

    // Retrieve exercises belonging to a workout ID
    List<WorkoutExercise> findByWorkoutId(Long workoutId);
}
