package com.fitnesstracker.controller;

import com.fitnesstracker.entity.Challenge;
import com.fitnesstracker.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * ChallengeController
 * Endpoints for fitness challenges, joining challenges, daily check-ins, and user challenges.
 */
@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    /**
     * GET /api/challenges
     * Retrieve all community challenges
     */
    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        List<Challenge> challenges = challengeService.getAllChallenges();
        return ResponseEntity.ok(challenges);
    }

    /**
     * GET /api/challenges/my
     * Retrieve challenges the logged-in user joined
     */
    @GetMapping("/my")
    public ResponseEntity<List<Challenge>> getMyChallenges(Principal principal, Authentication auth) {
        String userEmail = null;
        if (principal != null) {
            userEmail = principal.getName();
        } else if (auth != null) {
            userEmail = auth.getName();
        }
        List<Challenge> challenges = challengeService.getMyChallenges(userEmail);
        return ResponseEntity.ok(challenges);
    }

    /**
     * GET /api/challenges/{id}
     * Retrieve single challenge by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallengeById(@PathVariable Long id) {
        Challenge challenge = challengeService.getChallengeById(id);
        return ResponseEntity.ok(challenge);
    }

    /**
     * POST /api/challenges
     * Create a new challenge
     */
    @PostMapping
    public ResponseEntity<Challenge> createChallenge(@RequestBody Challenge challenge) {
        Challenge created = challengeService.createChallenge(challenge);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * POST /api/challenges/{id}/join
     * Join a challenge
     */
    @PostMapping("/{id}/join")
    public ResponseEntity<Challenge> joinChallenge(@PathVariable Long id, Principal principal, Authentication auth) {
        String userEmail = null;
        if (principal != null) {
            userEmail = principal.getName();
        } else if (auth != null) {
            userEmail = auth.getName();
        }
        Challenge updated = challengeService.joinChallenge(id, userEmail);
        return ResponseEntity.ok(updated);
    }

    /**
     * POST /api/challenges/{id}/checkin
     * Record a check-in towards the challenge
     */
    @PostMapping("/{id}/checkin")
    public ResponseEntity<Challenge> checkInChallenge(@PathVariable Long id, Principal principal, Authentication auth) {
        String userEmail = null;
        if (principal != null) {
            userEmail = principal.getName();
        } else if (auth != null) {
            userEmail = auth.getName();
        }
        Challenge updated = challengeService.checkInChallenge(id, userEmail);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/challenges/{id}
     * Delete a challenge
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteChallenge(@PathVariable Long id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Challenge deleted successfully"));
    }
}
