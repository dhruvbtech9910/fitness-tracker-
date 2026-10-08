package com.fitnesstracker.dto;

/**
 * ProgressSummaryDto
 * Aggregated analytics and progress stats for user dashboard and progress overview
 */
public class ProgressSummaryDto {

    private int totalWorkouts;
    private int totalMinutes;
    private int totalCalories;
    private int activeStreak;
    private int personalRecordsCount;
    private int completedGoals;
    private int activeGoals;

    public ProgressSummaryDto() {
    }

    public ProgressSummaryDto(int totalWorkouts, int totalMinutes, int totalCalories,
                              int activeStreak, int personalRecordsCount,
                              int completedGoals, int activeGoals) {
        this.totalWorkouts = totalWorkouts;
        this.totalMinutes = totalMinutes;
        this.totalCalories = totalCalories;
        this.activeStreak = activeStreak;
        this.personalRecordsCount = personalRecordsCount;
        this.completedGoals = completedGoals;
        this.activeGoals = activeGoals;
    }

    public int getTotalWorkouts() {
        return totalWorkouts;
    }

    public void setTotalWorkouts(int totalWorkouts) {
        this.totalWorkouts = totalWorkouts;
    }

    public int getTotalMinutes() {
        return totalMinutes;
    }

    public void setTotalMinutes(int totalMinutes) {
        this.totalMinutes = totalMinutes;
    }

    public int getTotalCalories() {
        return totalCalories;
    }

    public void setTotalCalories(int totalCalories) {
        this.totalCalories = totalCalories;
    }

    public int getActiveStreak() {
        return activeStreak;
    }

    public void setActiveStreak(int activeStreak) {
        this.activeStreak = activeStreak;
    }

    public int getPersonalRecordsCount() {
        return personalRecordsCount;
    }

    public void setPersonalRecordsCount(int personalRecordsCount) {
        this.personalRecordsCount = personalRecordsCount;
    }

    public int getCompletedGoals() {
        return completedGoals;
    }

    public void setCompletedGoals(int completedGoals) {
        this.completedGoals = completedGoals;
    }

    public int getActiveGoals() {
        return activeGoals;
    }

    public void setActiveGoals(int activeGoals) {
        this.activeGoals = activeGoals;
    }
}
