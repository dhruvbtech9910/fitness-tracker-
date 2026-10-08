package com.fitnesstracker.controller;

import com.fitnesstracker.entity.FitnessGoal;
import com.fitnesstracker.service.GoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

/**
 * GoalController
 * Endpoints for managing fitness goals, progress tracking, and milestones.
 */
@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalController {

    @Autowired
    private GoalService goalService;

    /**
     * GET /api/goals
     * Retrieve all fitness goals
     */
    @GetMapping
    public ResponseEntity<List<FitnessGoal>> getAllGoals() {
        List<FitnessGoal> goals = goalService.getAllGoals();
        return ResponseEntity.ok(goals);
    }

    /**
     * GET /api/goals/{id}
     * Retrieve single goal by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FitnessGoal> getGoalById(@PathVariable Long id) {
        FitnessGoal goal = goalService.getGoalById(id);
        return ResponseEntity.ok(goal);
    }

    /**
     * POST /api/goals
     * Create a new fitness goal
     */
    @PostMapping
    public ResponseEntity<FitnessGoal> createGoal(@RequestBody FitnessGoal goal, Principal principal, Authentication auth) {
        String userEmail = null;
        if (principal != null) {
            userEmail = principal.getName();
        } else if (auth != null) {
            userEmail = auth.getName();
        }
        FitnessGoal created = goalService.createGoal(goal, userEmail);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/goals/{id}
     * Update an existing fitness goal
     */
    @PutMapping("/{id}")
    public ResponseEntity<FitnessGoal> updateGoal(@PathVariable Long id, @RequestBody FitnessGoal goal) {
        FitnessGoal updated = goalService.updateGoal(id, goal);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/goals/{id}
     * Delete a goal
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteGoal(@PathVariable Long id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Goal deleted successfully"));
    }
}
