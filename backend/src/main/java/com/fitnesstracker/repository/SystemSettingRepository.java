package com.fitnesstracker.repository;

import com.fitnesstracker.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * SystemSettingRepository
 * Database access for platform settings and administrative toggles.
 */
@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {

    // Retrieve system setting by its unique key
    Optional<SystemSetting> findBySettingKey(String settingKey);
}
