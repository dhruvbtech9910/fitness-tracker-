package com.fitnesstracker.repository;

import com.fitnesstracker.entity.FitnessGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FitnessGoalRepository
 * Provides database access methods for user fitness goals.
 */
@Repository
public interface FitnessGoalRepository extends JpaRepository<FitnessGoal, Long> {

    // Retrieve goals belonging to a specific user
    List<FitnessGoal> findByUserId(Long userId);

    // Retrieve all goals in descending order
    List<FitnessGoal> findAllByOrderByIdDesc();
}
