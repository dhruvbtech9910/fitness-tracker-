package com.fitnesstracker.repository;

import com.fitnesstracker.entity.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ProgressRepository
 * Provides database access methods for personal records and progress achievements.
 */
@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {

    // Retrieve progress records for a given user
    List<Progress> findByUserId(Long userId);

    // Order by ID descending
    List<Progress> findAllByOrderByIdDesc();
}
