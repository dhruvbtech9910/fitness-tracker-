package com.fitnesstracker.dto;

/**
 * RegisterRequest DTO
 * Contains registration form fields from the frontend
 */
public class RegisterRequest {

    private String name;
    private String fullName;
    private String email;
    private String password;
    private String fitnessGoal;
    private String activityLevel;
    private Double weight;
    private Double targetWeight;
    private Double height;
    private Integer age;

    public RegisterRequest() {
    }

    public String getName() {
        if (name != null && !name.trim().isEmpty()) {
            return name;
        }
        return fullName;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName != null ? fullName : name;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFitnessGoal() {
        return fitnessGoal;
    }

    public void setFitnessGoal(String fitnessGoal) {
        this.fitnessGoal = fitnessGoal;
    }

    public String getActivityLevel() {
        return activityLevel;
    }

    public void setActivityLevel(String activityLevel) {
        this.activityLevel = activityLevel;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getTargetWeight() {
        return targetWeight;
    }

    public void setTargetWeight(Double targetWeight) {
        this.targetWeight = targetWeight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }
}
