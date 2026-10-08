package com.fitnesstracker.repository;

import com.fitnesstracker.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ExerciseRepository
 * Provides database access methods for Exercise entities.
 */
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    // Find exercises by category (e.g. "Chest", "Back")
    List<Exercise> findByCategory(String category);
}
