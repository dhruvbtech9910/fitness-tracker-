package com.fitnesstracker.service;

import com.fitnesstracker.dao.ChallengeDao;
import com.fitnesstracker.dao.UserDao;
import com.fitnesstracker.entity.Challenge;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ChallengeService
 * Handles community challenges, joining challenges, daily check-ins, and participant progress via JDBC ChallengeDao.
 */
@Service
public class ChallengeService {

    @Autowired
    private ChallengeDao challengeDao;

    @Autowired
    private UserDao userDao;

    /**
     * Retrieve all active challenges
     */
    public List<Challenge> getAllChallenges() {
        return challengeDao.findAll();
    }

    /**
     * Retrieve challenge by ID
     */
    public Challenge getChallengeById(Long id) {
        return challengeDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found with id: " + id));
    }

    /**
     * Create a new challenge
     */
    public Challenge createChallenge(Challenge challenge) {
        if (challenge.getParticipants() == null) challenge.setParticipants(1);
        if (challenge.getProgress() == null) challenge.setProgress(0);
        if (challenge.getJoined() == null) challenge.setJoined(false);
        if (challenge.getCompleted() == null) challenge.setCompleted(false);
        if (challenge.getCheckIns() == null) challenge.setCheckIns(0);
        if (challenge.getRequiredCheckIns() == null) {
            challenge.setRequiredCheckIns(challenge.getDurationDays() != null ? challenge.getDurationDays() : 14);
        }
        return challengeDao.save(challenge);
    }

    /**
     * Join an active challenge using JDBC transaction
     */
    public Challenge joinChallenge(Long id, String userEmail) {
        Long userId = null;
        if (userEmail != null) {
            Optional<User> userOpt = userDao.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                userId = userOpt.get().getId();
            }
        }
        return challengeDao.joinChallenge(id, userId);
    }

    /**
     * Daily check-in towards challenge completion using JDBC transaction
     */
    public Challenge checkInChallenge(Long id, String userEmail) {
        Long userId = null;
        if (userEmail != null) {
            Optional<User> userOpt = userDao.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                userId = userOpt.get().getId();
            }
        }
        return challengeDao.checkIn(id, userId);
    }

    /**
     * Retrieve challenges the user is participating in
     */
    public List<Challenge> getMyChallenges(String userEmail) {
        return challengeDao.findAll();
    }

    /**
     * Delete challenge by ID
     */
    public void deleteChallenge(Long id) {
        Challenge challenge = getChallengeById(id);
        boolean deleted = challengeDao.delete(challenge.getId());
        if (!deleted) {
            throw new RuntimeException("Failed to delete challenge with id: " + id);
        }
    }
}
