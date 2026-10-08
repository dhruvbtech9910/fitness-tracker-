package com.fitnesstracker.exception;

/**
 * BadRequestException
 * Thrown when user inputs invalid data (e.g. duplicate email, invalid credentials).
 */
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
