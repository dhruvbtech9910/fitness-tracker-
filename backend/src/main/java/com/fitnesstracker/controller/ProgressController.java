package com.fitnesstracker.controller;

import com.fitnesstracker.dto.ProgressSummaryDto;
import com.fitnesstracker.entity.Progress;
import com.fitnesstracker.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * ProgressController
 * Endpoints for personal records (PRs) and aggregated telemetry summaries.
 */
@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    /**
     * GET /api/progress
     * Retrieve all personal records (PRs)
     */
    @GetMapping
    public ResponseEntity<List<Progress>> getAllProgress() {
        List<Progress> records = progressService.getAllProgress();
        return ResponseEntity.ok(records);
    }

    /**
     * POST /api/progress
     * Add a new personal record entry
     */
    @PostMapping
    public ResponseEntity<Progress> addProgress(@RequestBody Progress progress, Principal principal, Authentication auth) {
        String userEmail = null;
        if (principal != null) {
            userEmail = principal.getName();
        } else if (auth != null) {
            userEmail = auth.getName();
        }
        Progress saved = progressService.addProgress(progress, userEmail);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /**
     * GET /api/progress/summary
     * Retrieve aggregated telemetry statistics
     */
    @GetMapping("/summary")
    public ResponseEntity<ProgressSummaryDto> getProgressSummary(Principal principal, Authentication auth) {
        String userEmail = null;
        if (principal != null) {
            userEmail = principal.getName();
        } else if (auth != null) {
            userEmail = auth.getName();
        }
        ProgressSummaryDto summary = progressService.getProgressSummary(userEmail);
        return ResponseEntity.ok(summary);
    }
}
