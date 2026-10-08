package com.fitnesstracker.repository;

import com.fitnesstracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository
 * Provides database access methods for User entities.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by their unique email address
    Optional<User> findByEmail(String email);

    // Check if an email is already registered in the system
    boolean existsByEmail(String email);
}
