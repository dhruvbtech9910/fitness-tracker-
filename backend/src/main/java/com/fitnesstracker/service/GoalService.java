package com.fitnesstracker.service;

import com.fitnesstracker.dao.GoalDao;
import com.fitnesstracker.dao.UserDao;
import com.fitnesstracker.entity.FitnessGoal;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * GoalService
 * Manages user fitness targets, milestone progress tracking, and goal completion via JDBC GoalDao.
 */
@Service
public class GoalService {

    @Autowired
    private GoalDao goalDao;

    @Autowired
    private UserDao userDao;

    /**
     * Retrieve all fitness goals
     */
    public List<FitnessGoal> getAllGoals() {
        return goalDao.findAll();
    }

    /**
     * Retrieve goal by ID
     */
    public FitnessGoal getGoalById(Long id) {
        return goalDao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Goal not found with id: " + id));
    }

    /**
     * Create a new fitness goal
     */
    public FitnessGoal createGoal(FitnessGoal goal, String userEmail) {
        Long userId = null;
        if (userEmail != null) {
            Optional<User> userOpt = userDao.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                userId = userOpt.get().getId();
                goal.setUser(userOpt.get());
            }
        }

        goal.calculateProgress();
        return goalDao.save(goal, userId);
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
        return goalDao.update(goal);
    }

    /**
     * Delete goal by ID
     */
    public void deleteGoal(Long id) {
        FitnessGoal goal = getGoalById(id);
        boolean deleted = goalDao.delete(goal.getId());
        if (!deleted) {
            throw new RuntimeException("Failed to delete goal with id: " + id);
        }
    }
}
