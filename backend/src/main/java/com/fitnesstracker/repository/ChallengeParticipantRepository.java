package com.fitnesstracker.repository;

import com.fitnesstracker.entity.ChallengeParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * ChallengeParticipantRepository
 * Tracks user participation, check-ins, and completion status in challenges.
 */
@Repository
public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipant, Long> {

    // Check if user is already participating in a challenge
    Optional<ChallengeParticipant> findByChallengeIdAndUserId(Long challengeId, Long userId);

    // List all challenges a user has joined
    List<ChallengeParticipant> findByUserId(Long userId);
}
