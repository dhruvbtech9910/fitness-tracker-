package com.fitnesstracker.repository;

import com.fitnesstracker.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * RoleRepository
 * Provides database access methods for Role entities.
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Find role by name (e.g. "ROLE_USER" or "ROLE_ADMIN")
    Optional<Role> findByName(String name);
}
