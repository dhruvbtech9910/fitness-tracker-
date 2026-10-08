package com.fitnesstracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

/**
 * Progress Entity
 * Stores user performance personal records (PRs), lifts, body metrics, and achievements.
 * Mapped to 'progress' table in MySQL database.
 */
@Entity
@Table(name = "progress")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String exercise; // e.g. "Barbell Bench Press", "Conventional Deadlift"

    private String weight; // e.g. "120 kg"

    private Integer reps;

    @Column(name = "body_fat")
    private Double bodyFat;

    @Column(name = "workout_count")
    private Integer workoutCount;

    @Column(name = "calories_burned")
    private Integer caloriesBurned;

    @Column(name = "recorded_date")
    private String recordedDate; // e.g. "Yesterday", "Last week"

    // Alias for frontend compatibility
    @Transient
    private String date;

    private String badge; // "Gold", "Diamond", "Silver"

    @Column(length = 1000)
    private String notes;

    // Default constructor
    public Progress() {
        this.badge = "Gold";
        this.reps = 1;
        this.workoutCount = 0;
        this.caloriesBurned = 0;
    }

    // Parameterized constructor
    public Progress(String exercise, String weight, Integer reps, String recordedDate, String badge) {
        this();
        this.exercise = exercise;
        this.weight = weight;
        this.reps = reps;
        this.recordedDate = recordedDate;
        this.date = recordedDate;
        this.badge = badge != null ? badge : "Gold";
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

    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Double getBodyFat() {
        return bodyFat;
    }

    public void setBodyFat(Double bodyFat) {
        this.bodyFat = bodyFat;
    }

    public Integer getWorkoutCount() {
        return workoutCount;
    }

    public void setWorkoutCount(Integer workoutCount) {
        this.workoutCount = workoutCount;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public String getRecordedDate() {
        return recordedDate != null ? recordedDate : date;
    }

    public void setRecordedDate(String recordedDate) {
        this.recordedDate = recordedDate;
        this.date = recordedDate;
    }

    public String getDate() {
        return date != null ? date : recordedDate;
    }

    public void setDate(String date) {
        this.date = date;
        if (this.recordedDate == null) {
            this.recordedDate = date;
        }
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
