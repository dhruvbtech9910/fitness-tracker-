package com.fitnesstracker.repository;

import com.fitnesstracker.entity.FitnessContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * FitnessContentRepository
 * Manages curated fitness workout routines and editorial training content.
 */
@Repository
public interface FitnessContentRepository extends JpaRepository<FitnessContent, Long> {

    // Retrieve by publication status
    List<FitnessContent> findByStatus(String status);
}
