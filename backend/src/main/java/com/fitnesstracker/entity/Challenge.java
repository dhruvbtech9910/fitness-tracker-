package com.fitnesstracker.entity;

import jakarta.persistence.*;

/**
 * Challenge Entity
 * Represents global or community fitness challenges and streak goals.
 */
@Entity
@Table(name = "challenges")
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String category; // "Strength", "Endurance", "Consistency", "Core"

    private String reward; // e.g. "Iron Chest Badge", "Aero Runner Trophy"

    @Column(length = 1000)
    private String description;

    private Integer participants;

    private Integer daysLeft;

    private Integer durationDays;

    private Integer progress; // percentage

    private Boolean joined;

    private Boolean completed;

    private Integer checkIns;

    private Integer requiredCheckIns;

    private String startDate;

    private String endDate;

    private String target;

    private String status; // "Active", "Completed", "Upcoming"

    // Default constructor
    public Challenge() {
        this.participants = 0;
        this.progress = 0;
        this.joined = false;
        this.completed = false;
        this.checkIns = 0;
        this.requiredCheckIns = 14;
        this.status = "Active";
    }

    // Parameterized constructor
    public Challenge(String title, String category, String reward, String description,
                     Integer durationDays, Integer requiredCheckIns) {
        this();
        this.title = title;
        this.category = category;
        this.reward = reward;
        this.description = description;
        this.durationDays = durationDays;
        this.daysLeft = durationDays;
        this.requiredCheckIns = requiredCheckIns != null ? requiredCheckIns : durationDays;
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

    public String getReward() {
        return reward;
    }

    public void setReward(String reward) {
        this.reward = reward;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getParticipants() {
        return participants;
    }

    public void setParticipants(Integer participants) {
        this.participants = participants;
    }

    public Integer getDaysLeft() {
        return daysLeft;
    }

    public void setDaysLeft(Integer daysLeft) {
        this.daysLeft = daysLeft;
    }

    public Integer getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(Integer durationDays) {
        this.durationDays = durationDays;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public Boolean getJoined() {
        return joined;
    }

    public void setJoined(Boolean joined) {
        this.joined = joined;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Integer getCheckIns() {
        return checkIns;
    }

    public void setCheckIns(Integer checkIns) {
        this.checkIns = checkIns;
    }

    public Integer getRequiredCheckIns() {
        return requiredCheckIns;
    }

    public void setRequiredCheckIns(Integer requiredCheckIns) {
        this.requiredCheckIns = requiredCheckIns;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Alias for name
    public String getName() {
        return title;
    }

    public void setName(String name) {
        this.title = name;
    }
}
