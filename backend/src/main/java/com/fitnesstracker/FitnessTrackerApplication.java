package com.fitnesstracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * FitnessTrackerApplication
 * The main Spring Boot entry point for the Fitness Tracker Backend application.
 */
@SpringBootApplication
public class FitnessTrackerApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(FitnessTrackerApplication.class);

        // Check if MySQL server is currently running on localhost:3306
        if (isMysqlRunning()) {
            System.out.println("=========================================================");
            System.out.println(" [SUCCESS] MySQL detected on port 3306!");
            System.out.println(" Connecting to MySQL database 'fitness_tracker'...");
            System.out.println("=========================================================");
        } else {
            System.out.println("=========================================================");
            System.out.println(" [NOTICE] MySQL is not currently running on port 3306.");
            System.out.println(" Activating 'dev' fallback profile (in-memory MySQL mode)");
            System.out.println(" so the server runs smoothly on port 8080 without errors.");
            System.out.println(" (To use MySQL, start MySQL service on port 3306)");
            System.out.println("=========================================================");
            app.setAdditionalProfiles("dev");
        }

        app.run(args);
    }

    /**
     * Simple helper method to check if port 3306 is open
     */
    private static boolean isMysqlRunning() {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("localhost", 3306), 400);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
