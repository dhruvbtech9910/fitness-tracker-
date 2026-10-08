package com.fitnesstracker.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

/**
 * ChallengeParticipant Entity
 * Links users to challenges they have joined and tracks individual check-in milestones.
 */
@Entity
@Table(name = "challenge_participants")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ChallengeParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "challenge_id", nullable = false)
    @JsonIgnore
    private Challenge challenge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    private Integer checkIns;

    private Integer progress; // percentage

    private Boolean completed;

    private String status;

    private String joinedDate;

    // Default constructor
    public ChallengeParticipant() {
        this.checkIns = 0;
        this.progress = 0;
        this.completed = false;
        this.status = "Active";
    }

    // Parameterized constructor
    public ChallengeParticipant(Challenge challenge, User user) {
        this();
        this.challenge = challenge;
        this.user = user;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Challenge getChallenge() {
        return challenge;
    }

    public void setChallenge(Challenge challenge) {
        this.challenge = challenge;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getCheckIns() {
        return checkIns;
    }

    public void setCheckIns(Integer checkIns) {
        this.checkIns = checkIns;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getJoinedDate() {
        return joinedDate;
    }

    public void setJoinedDate(String joinedDate) {
        this.joinedDate = joinedDate;
    }
}
