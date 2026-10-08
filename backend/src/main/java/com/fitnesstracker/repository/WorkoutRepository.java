package com.fitnesstracker.repository;

import com.fitnesstracker.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * WorkoutRepository
 * Provides database access methods for Workout routines.
 */
@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {

    // Retrieve workouts associated with a specific user
    List<Workout> findByUserId(Long userId);

    // Retrieve popular workouts
    List<Workout> findByIsPopularTrue();

    // Order all workouts from newest to oldest
    List<Workout> findAllByOrderByIdDesc();
}
