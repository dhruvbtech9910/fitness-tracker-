package com.fitnesstracker.service;

import com.fitnesstracker.dao.GoalDao;
import com.fitnesstracker.dao.ProgressDao;
import com.fitnesstracker.dao.UserDao;
import com.fitnesstracker.dao.WorkoutDao;
import com.fitnesstracker.dto.ProgressSummaryDto;
import com.fitnesstracker.entity.FitnessGoal;
import com.fitnesstracker.entity.Progress;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.entity.Workout;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ProgressService
 * Manages personal record entries and aggregates dashboard telemetry via JDBC DAOs.
 */
@Service
public class ProgressService {

    @Autowired
    private ProgressDao progressDao;

    @Autowired
    private WorkoutDao workoutDao;

    @Autowired
    private GoalDao goalDao;

    @Autowired
    private UserDao userDao;

    /**
     * Get all personal records and milestones
     */
    public List<Progress> getAllProgress() {
        return progressDao.findAll();
    }

    /**
     * Add a new personal record entry
     */
    public Progress addProgress(Progress progress, String userEmail) {
        Long userId = null;
        if (userEmail != null) {
            Optional<User> userOpt = userDao.findByEmail(userEmail);
            if (userOpt.isPresent()) {
                userId = userOpt.get().getId();
                progress.setUser(userOpt.get());
            }
        }
        if (progress.getDate() == null) {
            progress.setDate("Today");
        }
        if (progress.getBadge() == null) {
            progress.setBadge("Gold");
        }
        return progressDao.save(progress, userId);
    }

    /**
     * Aggregate telemetry data for summary cards
     */
    public ProgressSummaryDto getProgressSummary(String userEmail) {
        List<Workout> workouts = workoutDao.findAll();
        int totalWorkouts = workouts.size();
        int totalMinutes = 0;
        int totalCalories = 0;

        for (Workout w : workouts) {
            totalMinutes += (w.getDurationMinutes() != null ? w.getDurationMinutes() : 45);
            totalCalories += (w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 450);
        }

        int activeStreak = 14;
        if (userEmail != null) {
            Optional<User> userOpt = userDao.findByEmail(userEmail);
            if (userOpt.isPresent() && userOpt.get().getActiveStreak() != null) {
                activeStreak = userOpt.get().getActiveStreak();
            }
        }

        int prCount = (int) progressDao.count();

        List<FitnessGoal> goals = goalDao.findAll();
        int completedGoals = 0;
        int activeGoals = 0;

        for (FitnessGoal g : goals) {
            if ("completed".equalsIgnoreCase(g.getStatus()) || (g.getProgress() != null && g.getProgress() >= 100)) {
                completedGoals++;
            } else {
                activeGoals++;
            }
        }

        return new ProgressSummaryDto(
                totalWorkouts,
                totalMinutes,
                totalCalories,
                activeStreak,
                prCount,
                completedGoals,
                activeGoals
        );
    }
}
