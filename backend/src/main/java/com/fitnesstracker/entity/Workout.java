package com.fitnesstracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Workout Entity
 * Represents a completed or scheduled training routine.
 */
@Entity
@Table(name = "workouts")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String category; // "Strength", "HIIT", "Mobility", "Hypertrophy", etc.

    private String duration; // e.g. "55 Min"

    private Integer durationMinutes; // e.g. 55

    private String calories; // e.g. "520 kcal"

    private Integer caloriesBurned; // e.g. 520

    private String difficulty; // "Beginner", "Intermediate", "Advanced", "Elite"

    private Integer exercisesCount;

    private String targetMuscles; // e.g. "Chest, Triceps, Front Delts"

    private String date; // ISO timestamp or friendly date

    private Boolean isPopular;

    @Column(length = 1000)
    private String description;

    // Optional association with user who created the workout
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    // One workout has many exercises
    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<WorkoutExercise> exercises = new ArrayList<>();

    // Default constructor
    public Workout() {
        this.isPopular = false;
    }

    // Helper method to add an exercise
    public void addExercise(WorkoutExercise exercise) {
        exercises.add(exercise);
        exercise.setWorkout(this);
    }

    // Helper method to remove an exercise
    public void removeExercise(WorkoutExercise exercise) {
        exercises.remove(exercise);
        exercise.setWorkout(null);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // Alias for workout_name
    public String getWorkoutName() {
        return title;
    }

    public void setWorkoutName(String workoutName) {
        this.title = workoutName;
    }

    // Alias for workout_date
    public String getWorkoutDate() {
        return date;
    }

    public void setWorkoutDate(String workoutDate) {
        this.date = workoutDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
        if (durationMinutes != null && this.duration == null) {
            this.duration = durationMinutes + " Min";
        }
    }

    public String getCalories() {
        return calories;
    }

    public void setCalories(String calories) {
        this.calories = calories;
    }

    public Integer getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(Integer caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
        if (caloriesBurned != null && this.calories == null) {
            this.calories = caloriesBurned + " kcal";
        }
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getExercisesCount() {
        return exercisesCount;
    }

    public void setExercisesCount(Integer exercisesCount) {
        this.exercisesCount = exercisesCount;
    }

    public String getTargetMuscles() {
        return targetMuscles;
    }

    public void setTargetMuscles(String targetMuscles) {
        this.targetMuscles = targetMuscles;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Boolean getIsPopular() {
        return isPopular;
    }

    public void setIsPopular(Boolean isPopular) {
        this.isPopular = isPopular;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<WorkoutExercise> getExercises() {
        return exercises;
    }

    public void setExercises(List<WorkoutExercise> exercises) {
        this.exercises = exercises;
        if (exercises != null) {
            for (WorkoutExercise ex : exercises) {
                ex.setWorkout(this);
            }
        }
    }
}
