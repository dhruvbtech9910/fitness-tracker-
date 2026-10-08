package com.fitnesstracker.dto;

import com.fitnesstracker.entity.User;

/**
 * AuthResponse DTO
 * Returned upon successful login or registration with JWT token and user profile
 */
public class AuthResponse {

    private String token;
    private User user;
    private String message;

    public AuthResponse() {
    }

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = user;
        this.message = "Authentication successful";
    }

    public AuthResponse(String token, User user, String message) {
        this.token = token;
        this.user = user;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
