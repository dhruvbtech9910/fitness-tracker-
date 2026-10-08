package com.fitnesstracker.service;

import com.fitnesstracker.entity.Challenge;
import com.fitnesstracker.entity.ChallengeParticipant;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.exception.ResourceNotFoundException;
import com.fitnesstracker.repository.ChallengeParticipantRepository;
import com.fitnesstracker.repository.ChallengeRepository;
import com.fitnesstracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * ChallengeService
 * Handles community challenges, joining challenges, daily check-ins, and participant progress.
 */
@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private ChallengeParticipantRepository participantRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieve all active challenges
     */
    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAllByOrderByIdDesc();
    }

    /**
     * Retrieve challenge by ID
     */
    public Challenge getChallengeById(Long id) {
        return challengeRepository.findById(id)
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
        return challengeRepository.save(challenge);
    }

    /**
     * Join an active challenge
     */
    public Challenge joinChallenge(Long id, String userEmail) {
        Challenge challenge = getChallengeById(id);
        challenge.setJoined(true);
        challenge.setParticipants(challenge.getParticipants() + 1);

        if (userEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Optional<ChallengeParticipant> existingPart = participantRepository.findByChallengeIdAndUserId(id, user.getId());
                if (existingPart.isEmpty()) {
                    ChallengeParticipant participant = new ChallengeParticipant(challenge, user);
                    participant.setJoinedDate(LocalDate.now().toString());
                    participantRepository.save(participant);
                }
            }
        }

        return challengeRepository.save(challenge);
    }

    /**
     * Daily check-in towards challenge completion
     */
    public Challenge checkInChallenge(Long id, String userEmail) {
        Challenge challenge = getChallengeById(id);

        int currentCheckIns = challenge.getCheckIns() != null ? challenge.getCheckIns() : 0;
        int nextCheckIns = currentCheckIns + 1;
        challenge.setCheckIns(nextCheckIns);

        int required = challenge.getRequiredCheckIns() != null ? challenge.getRequiredCheckIns() : 14;
        int computedProgress = Math.min((int) Math.round(((double) nextCheckIns / required) * 100), 100);
        challenge.setProgress(computedProgress);
        challenge.setCompleted(computedProgress >= 100);

        if (userEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Optional<ChallengeParticipant> partOpt = participantRepository.findByChallengeIdAndUserId(id, user.getId());
                if (partOpt.isPresent()) {
                    ChallengeParticipant part = partOpt.get();
                    part.setCheckIns(nextCheckIns);
                    part.setProgress(computedProgress);
                    part.setCompleted(computedProgress >= 100);
                    participantRepository.save(part);
                }
            }
        }

        return challengeRepository.save(challenge);
    }

    /**
     * Retrieve challenges the user is participating in
     */
    public List<Challenge> getMyChallenges(String userEmail) {
        if (userEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                List<ChallengeParticipant> parts = participantRepository.findByUserId(userOpt.get().getId());
                List<Challenge> result = new ArrayList<>();
                for (ChallengeParticipant p : parts) {
                    result.add(p.getChallenge());
                }
                return result;
            }
        }
        return challengeRepository.findAll();
    }

    /**
     * Delete challenge by ID
     */
    public void deleteChallenge(Long id) {
        Challenge challenge = getChallengeById(id);
        challengeRepository.delete(challenge);
    }
}
