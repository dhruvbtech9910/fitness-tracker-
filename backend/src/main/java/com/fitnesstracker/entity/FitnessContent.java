package com.fitnesstracker.entity;

import jakarta.persistence.*;

/**
 * FitnessContent Entity
 * Represents curated training plans, educational fitness content, and articles managed by admins.
 */
@Entity
@Table(name = "fitness_content")
public class FitnessContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String category; // "Strength", "HIIT", "Mobility"

    private String level; // "Beginner", "Intermediate", "Advanced", "Elite"

    private String status; // "Published", "Draft", "Archived"

    @Column(length = 2000)
    private String description;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    // Default constructor
    public FitnessContent() {
        this.status = "Published";
    }

    // Parameterized constructor
    public FitnessContent(String title, String category, String level, String status, String description) {
        this.title = title;
        this.category = category;
        this.level = level;
        this.status = status != null ? status : "Published";
        this.description = description;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
