package com.fitnesstracker.exception;

/**
 * ResourceNotFoundException
 * Thrown when an entity (User, Workout, Goal, etc.) is not found in the database.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
