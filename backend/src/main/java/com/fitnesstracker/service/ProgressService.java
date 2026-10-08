package com.fitnesstracker.service;

import com.fitnesstracker.dto.ProgressSummaryDto;
import com.fitnesstracker.entity.FitnessGoal;
import com.fitnesstracker.entity.Progress;
import com.fitnesstracker.entity.User;
import com.fitnesstracker.entity.Workout;
import com.fitnesstracker.repository.FitnessGoalRepository;
import com.fitnesstracker.repository.ProgressRepository;
import com.fitnesstracker.repository.UserRepository;
import com.fitnesstracker.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * ProgressService
 * Manages personal record entries and aggregates dashboard telemetry.
 */
@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private FitnessGoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all personal records and milestones
     */
    public List<Progress> getAllProgress() {
        return progressRepository.findAllByOrderByIdDesc();
    }

    /**
     * Add a new personal record entry
     */
    public Progress addProgress(Progress progress, String userEmail) {
        if (userEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            userOpt.ifPresent(progress::setUser);
        }
        if (progress.getDate() == null) {
            progress.setDate("Today");
        }
        if (progress.getBadge() == null) {
            progress.setBadge("Gold");
        }
        return progressRepository.save(progress);
    }

    /**
     * Aggregate telemetry data for summary cards
     */
    public ProgressSummaryDto getProgressSummary(String userEmail) {
        List<Workout> workouts = workoutRepository.findAll();
        int totalWorkouts = workouts.size();
        int totalMinutes = 0;
        int totalCalories = 0;

        for (Workout w : workouts) {
            totalMinutes += (w.getDurationMinutes() != null ? w.getDurationMinutes() : 45);
            totalCalories += (w.getCaloriesBurned() != null ? w.getCaloriesBurned() : 450);
        }

        int activeStreak = 14;
        if (userEmail != null) {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isPresent() && userOpt.get().getActiveStreak() != null) {
                activeStreak = userOpt.get().getActiveStreak();
            }
        }

        int prCount = (int) progressRepository.count();

        List<FitnessGoal> goals = goalRepository.findAll();
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
