package com.fitnesstracker.service;

import com.fitnesstracker.entity.FitnessGoal;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.exception.ResourceNotFoundException;
import com.fitnesstracker.repository.FitnessGoalRepository;
import com.fitnesstracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * GoalService
 * Manages user fitness targets, milestone progress tracking, and goal completion.
 */
@Service
public class GoalService {

    @Autowired
    private FitnessGoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Retrieve all fitness goals
     */
    public List<FitnessGoal> getAllGoals() {
        return goalRepository.findAllByOrderByIdDesc();
    }

    /**
     * Retrieve goal by ID
     */
    public FitnessGoal getGoalById(Long id) {
        return goalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
    }

    /**
     * Create a new fitness goal
     */
    public FitnessGoal createGoal(FitnessGoal goal, String userEmail) {
        if (userEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            userOpt.ifPresent(goal::setUser);
        }

        goal.calculateProgress();
        return goalRepository.save(goal);
    }

    /**
     * Update an existing fitness goal
     */
    public FitnessGoal updateGoal(Long id, FitnessGoal updates) {
        FitnessGoal goal = getGoalById(id);

        if (updates.getTitle() != null) goal.setTitle(updates.getTitle());
        if (updates.getCategory() != null) goal.setCategory(updates.getCategory());
        if (updates.getCurrent() != null) goal.setCurrent(updates.getCurrent());
        if (updates.getTarget() != null) goal.setTarget(updates.getTarget());
        if (updates.getUnit() != null) goal.setUnit(updates.getUnit());
        if (updates.getDeadline() != null) goal.setDeadline(updates.getDeadline());
        if (updates.getNotes() != null) goal.setNotes(updates.getNotes());
        if (updates.getProgress() != null) goal.setProgress(updates.getProgress());

        goal.calculateProgress();
        return goalRepository.save(goal);
    }

    /**
     * Delete goal by ID
     */
    public void deleteGoal(Long id) {
        FitnessGoal goal = getGoalById(id);
        goalRepository.delete(goal);
    }
}
