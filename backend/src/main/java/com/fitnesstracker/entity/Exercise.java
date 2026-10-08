package com.fitnesstracker.entity;

import jakarta.persistence.*;

/**
 * Exercise Entity
 * Represents standard catalog exercises (e.g. Barbell Bench Press, Deadlift, Squat)
 */
@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    private String targetMuscle;

    private String difficulty; // "Beginner", "Intermediate", "Advanced", "Elite"

    @Column(length = 500)
    private String description;

    // Default constructor
    public Exercise() {
        this.difficulty = "Intermediate";
    }

    // Parameterized constructor
    public Exercise(String name, String category, String targetMuscle, String description) {
        this.name = name;
        this.category = category;
        this.targetMuscle = targetMuscle;
        this.description = description;
        this.difficulty = "Intermediate";
    }

    public Exercise(String name, String category, String targetMuscle, String difficulty, String description) {
        this.name = name;
        this.category = category;
        this.targetMuscle = targetMuscle;
        this.difficulty = difficulty != null ? difficulty : "Intermediate";
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTargetMuscle() {
        return targetMuscle;
    }

    public void setTargetMuscle(String targetMuscle) {
        this.targetMuscle = targetMuscle;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
