package com.fitnesstracker.repository;

import com.fitnesstracker.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ChallengeRepository
 * Provides database access methods for community fitness challenges.
 */
@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {

    // Retrieve challenges in order
    List<Challenge> findAllByOrderByIdDesc();
}
