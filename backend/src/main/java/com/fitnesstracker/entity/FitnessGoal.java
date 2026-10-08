package com.fitnesstracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

/**
 * FitnessGoal Entity
 * Tracks user fitness targets, current milestones, deadlines, and completion percentages.
 */
@Entity
@Table(name = "fitness_goals")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FitnessGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String title;

    private String category; // "Muscle Gain", "Weight Loss", "Strength", "Endurance", "Habit"

    @Column(name = "current_val")
    private Double current;

    @Column(name = "target_val")
    private Double target;

    private String unit; // "kg", "min", "reps", "days"

    private String deadline;

    private String startDate;

    private Integer progress; // percentage (0 - 100)

    private String status; // "in-progress", "completed"

    @Column(length = 500)
    private String notes;

    // Default constructor
    public FitnessGoal() {
        this.progress = 0;
        this.status = "in-progress";
    }

    // Parameterized constructor
    public FitnessGoal(String title, String category, Double current, Double target, String unit, String deadline, String notes) {
        this();
        this.title = title;
        this.category = category;
        this.current = current;
        this.target = target;
        this.unit = unit;
        this.deadline = deadline;
        this.notes = notes;
        calculateProgress();
    }

    // Helper method to compute progress percentage
    public void calculateProgress() {
        if (target != null && target > 0 && current != null) {
            int calculated = (int) Math.round((current / target) * 100.0);
            this.progress = Math.min(Math.max(calculated, 0), 100);
            this.status = this.progress >= 100 ? "completed" : "in-progress";
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getCurrent() {
        return current;
    }

    public void setCurrent(Double current) {
        this.current = current;
        calculateProgress();
    }

    public Double getTarget() {
        return target;
    }

    public void setTarget(Double target) {
        this.target = target;
        calculateProgress();
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
        if (progress != null && progress >= 100) {
            this.status = "completed";
        }
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    // Alias methods for alternative property names
    public String getGoalName() {
        return title;
    }

    public void setGoalName(String goalName) {
        this.title = goalName;
    }

    public String getDescription() {
        return notes;
    }

    public void setDescription(String description) {
        this.notes = description;
    }

    public Double getCurrentValue() {
        return current;
    }

    public void setCurrentValue(Double currentValue) {
        this.current = currentValue;
        calculateProgress();
    }

    public Double getTargetValue() {
        return target;
    }

    public void setTargetValue(Double targetValue) {
        this.target = targetValue;
        calculateProgress();
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getTargetDate() {
        return deadline;
    }

    public void setTargetDate(String targetDate) {
        this.deadline = targetDate;
    }
}
