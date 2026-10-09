-- ==============================================================================
-- FITNESS TRACKER DATABASE SCRIPT
-- ==============================================================================
-- Database: fitness_tracker
-- Purpose: Complete schema creation, relationships, and seed data for
--          the Fitness Tracker Spring Boot + React Application.
-- Author: Fitness Tracker Engineering Team
-- ==============================================================================

-- 1. CREATE DATABASE
CREATE DATABASE IF NOT EXISTS fitness_tracker
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2. USE DATABASE
USE fitness_tracker;

-- Disable foreign key checks during table drop/recreation sequence (clean setup)
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- DROP EXISTING TABLES (Reverse dependency order)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS challenge_participants;
DROP TABLE IF EXISTS challenges;
DROP TABLE IF EXISTS workout_exercises;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS fitness_goals;
DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS fitness_content;
DROP TABLE IF EXISTS system_settings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- ==============================================================================
-- TABLE 1: roles
-- Defines user authorization tiers (USER / Athlete, ADMIN / System Admin, Coach)
-- ==============================================================================
CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 2: users
-- Stores credentials, bio metrics, profile settings, and membership metadata
-- ==============================================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NUll,
    role_id BIGINT NULL,
    role VARCHAR(50) DEFAULT 'Athlete',
    avatar VARCHAR(500) NULL,
    age INT DEFAULT 25,
    gender VARCHAR(20) DEFAULT 'Not Specified',
    height DOUBLE DEFAULT 175.0,
    weight DOUBLE DEFAULT 75.0,
    target_weight DOUBLE DEFAULT 75.0,
    fitness_goal VARCHAR(150) DEFAULT 'General Fitness',
    activity_level VARCHAR(100) DEFAULT 'Moderately Active',
    status VARCHAR(50) DEFAULT 'Active',
    active_streak INT DEFAULT 1,
    workouts_completed INT DEFAULT 0,
    total_calories_burned INT DEFAULT 0,
    membership_tier VARCHAR(50) DEFAULT 'Pro Athlete',
    joined_date VARCHAR(50) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE SET NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_role_id (role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 3: exercises
-- Catalog of standardized fitness exercises and muscle target data
-- ==============================================================================
CREATE TABLE exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    target_muscle VARCHAR(100) NULL,
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_exercises_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 4: workouts
-- User workout logging sessions, routines, categories, and calorie expenditures
-- ==============================================================================
CREATE TABLE workouts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Strength',
    duration VARCHAR(50) DEFAULT '45 Min',
    duration_minutes INT DEFAULT 45,
    calories VARCHAR(50) DEFAULT '400 kcal',
    calories_burned INT DEFAULT 400,
    difficulty VARCHAR(50) DEFAULT 'Intermediate',
    exercises_count INT DEFAULT 0,
    target_muscles VARCHAR(255) NULL,
    date VARCHAR(100) NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_workouts_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_workouts_user_id (user_id),
    INDEX idx_workouts_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 5: workout_exercises
-- Many-to-one junction items connecting workouts with specific exercises & sets
-- ==============================================================================
CREATE TABLE workout_exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workout_id BIGINT NOT NULL,
    exercise_id BIGINT NULL,
    name VARCHAR(100) NOT NULL,
    sets INT DEFAULT 3,
    reps INT DEFAULT 10,
    weight DOUBLE DEFAULT 0.0,
    duration INT DEFAULT 0,
    notes VARCHAR(255) NULL,
    completed BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_we_workout FOREIGN KEY (workout_id) REFERENCES workouts (id) ON DELETE CASCADE,
    CONSTRAINT fk_we_exercise FOREIGN KEY (exercise_id) REFERENCES exercises (id) ON DELETE SET NULL,
    INDEX idx_we_workout_id (workout_id),
    INDEX idx_we_exercise_id (exercise_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 6: fitness_goals
-- User milestones, target values, deadlines, and live progress completion %
-- ==============================================================================
CREATE TABLE fitness_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Strength',
    current_val DOUBLE DEFAULT 0.0,
    target_val DOUBLE DEFAULT 100.0,
    unit VARCHAR(30) DEFAULT 'kg',
    deadline VARCHAR(100) NULL,
    progress INT DEFAULT 0,
    status VARCHAR(50) DEFAULT 'in-progress',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_goals_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_goals_user_id (user_id),
    INDEX idx_goals_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 7: progress
-- Personal record (PR) lift milestones, metric tracking, and badges
-- ==============================================================================
CREATE TABLE progress (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    exercise VARCHAR(100) NOT NULL,
    weight VARCHAR(50) NULL,
    reps INT DEFAULT 1,
    body_fat DOUBLE NULL,
    workout_count INT DEFAULT 0,
    calories_burned INT DEFAULT 0,
    recorded_date VARCHAR(100) NULL,
    badge VARCHAR(50) DEFAULT 'Gold',
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_progress_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 8: challenges
-- Global community challenges, duration days, check-in requirements & rewards
-- ==============================================================================
CREATE TABLE challenges (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) DEFAULT 'Strength',
    reward VARCHAR(100) NULL,
    description TEXT NULL,
    participants INT DEFAULT 0,
    days_left INT DEFAULT 14,
    duration_days INT DEFAULT 14,
    progress INT DEFAULT 0,
    joined BOOLEAN DEFAULT FALSE,
    completed BOOLEAN DEFAULT FALSE,
    check_ins INT DEFAULT 0,
    required_check_ins INT DEFAULT 14,
    start_date DATE NULL,
    end_date DATE NULL,
    target VARCHAR(100) NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_challenges_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 9: challenge_participants
-- Junction table linking users to challenges with check-in count & progress %
-- ==============================================================================
CREATE TABLE challenge_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    challenge_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    check_ins INT DEFAULT 0,
    progress INT DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'Active',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cp_challenge FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON DELETE CASCADE,
    CONSTRAINT fk_cp_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uk_challenge_user UNIQUE (challenge_id, user_id),
    INDEX idx_cp_user_id (user_id),
    INDEX idx_cp_challenge_id (challenge_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 10: fitness_content
-- Educational fitness articles, curated training plans, and recovery tips
-- ==============================================================================
CREATE TABLE fitness_content (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    level VARCHAR(50) DEFAULT 'All Levels',
    status VARCHAR(50) DEFAULT 'Published',
    description TEXT NULL,
    content LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_content_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- TABLE 11: system_settings
-- Administrative key-value configuration toggles
-- ==============================================================================
CREATE TABLE system_settings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description VARCHAR(255) NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==============================================================================
-- SAMPLE DATA (DEMO SEEDING)
--
-- NOTE ON PASSWORDS:
-- Passwords are encrypted using Spring Security's BCryptPasswordEncoder ($2a$10$).
-- Demo Credentials:
-- 1. System Admin:
--    Email:    admin@fitpulse.pro
--    Password: admin123
--
-- 2. Athlete User (Default interactive account):
--    Email:    alex.vance@fitpulse.pro
--    Password: user123
--
-- 3. Standard User:
--    Email:    user@example.com
--    Password: user123
-- ==============================================================================

-- 1. ROLES SEED
INSERT INTO roles (id, name, description) VALUES
(1, 'Athlete', 'Standard athlete user role for fitness tracking'),
(2, 'System Admin', 'Administrative role with full moderation privileges'),
(3, 'Coach', 'Trainer role for supervising athlete routines');

-- 2. USERS SEED
INSERT INTO users (id, name, email, password, role_id, role, avatar, age, gender, height, weight, target_weight, fitness_goal, activity_level, status, active_streak, workouts_completed, total_calories_burned, membership_tier, joined_date) VALUES
(1, 'Marcus Thorne', 'admin@fitpulse.pro', '$2a$10$lWB.DQYHl7yU8N5s1YJThOIk5FhwnuO.mlFzwpXsghspgeOoQdmzW', 2, 'System Admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', 32, 'Male', 182.0, 84.0, 85.0, 'System Administration & Elite Conditioning', 'Very Active', 'Active', 45, 210, 105000, 'System Admin', 'December 2025'),
(2, 'Alex Vance', 'alex.vance@fitpulse.pro', '$2a$10$Ok0.C5oTfJgIh/qkA4W4zuwqNTkK1SMXol4wcVgM3s7IhQfKqVaV.', 1, 'Athlete', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', 26, 'Male', 181.0, 78.5, 82.0, 'Hypertrophy & Athletic Conditioning', 'Very Active', 'Active', 14, 68, 38400, 'Pro Athlete', 'January 2026'),
(3, 'John Doe', 'user@example.com', '$2a$10$Ok0.C5oTfJgIh/qkA4W4zuwqNTkK1SMXol4wcVgM3s7IhQfKqVaV.', 1, 'Athlete', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80', 28, 'Male', 178.0, 75.0, 73.0, 'General Fitness & Fat Loss', 'Moderately Active', 'Active', 7, 24, 12500, 'Pro Athlete', 'February 2026');

-- 3. EXERCISES SEED
INSERT INTO exercises (id, name, category, target_muscle, difficulty, description) VALUES
(1, 'Incline Barbell Bench Press', 'Chest', 'Upper Pecs', 'Intermediate', 'Incline pressing to target clavicular pectoralis fibers'),
(2, 'Weighted Ring Dips', 'Chest', 'Lower Pecs & Triceps', 'Advanced', 'Suspended dip variation challenging shoulder stabilization'),
(3, 'Standing Overhead DB Press', 'Shoulders', 'Anterior & Lateral Delts', 'Intermediate', 'Vertical shoulder press for unilateral balance'),
(4, 'Cable Upper Pec Crossover', 'Chest', 'Inner Pecs', 'Beginner', 'Constant mechanical tension through horizontal adduction'),
(5, 'Overhead Rope Cable Extension', 'Triceps', 'Triceps Long Head', 'Beginner', 'Overhead tricep extension for maximum stretch'),
(6, 'Conventional Barbell Deadlift', 'Back', 'Posterior Chain & Hamstrings', 'Advanced', 'Foundational compound hinge movement from the floor'),
(7, 'Chest-Supported T-Bar Row', 'Back', 'Rhomboids & Mid-Back', 'Intermediate', 'Heavy rowing with strict lumbar support'),
(8, 'Romanian Dumbbell Deadlift', 'Legs', 'Hamstrings & Glutes', 'Intermediate', 'Eccentric hamstring loading with strict pelvic hinge'),
(9, 'Neutral-Grip Lat Pulldown', 'Back', 'Latissimus Dorsi', 'Beginner', 'Vertical pulling movement for back lat width'),
(10, 'Barbell Pendlay Row', 'Back', 'Upper Back & Lats', 'Advanced', 'Dead-stop explosive barbell row from floor'),
(11, 'Barbell Back Squat', 'Legs', 'Quadriceps & Glutes', 'Advanced', 'Foundational lower body knee flexion powerhouse'),
(12, 'Kettlebell Swing & Burpee Ladder', 'Full Body', 'Full Body & Core', 'Advanced', 'Anaerobic metabolic conditioning complex');

-- 4. WORKOUTS SEED
INSERT INTO workouts (id, user_id, title, category, duration, duration_minutes, calories, calories_burned, difficulty, exercises_count, target_muscles, date, is_popular, description) VALUES
(1, 2, 'Hypertrophy Push Dominance', 'Strength', '55 Min', 55, '520 kcal', 520, 'Intermediate', 5, 'Chest, Triceps, Front Delts', 'Yesterday', TRUE, 'High-density hypertrophy sequence prioritizing mechanical tension across incline angles.'),
(2, 2, 'Posterior Chain Deadlift Engine', 'Strength', '65 Min', 65, '640 kcal', 640, 'Advanced', 5, 'Hamstrings, Lats, Erectors, Glutes', '2 days ago', TRUE, 'Pure hinge mechanics and heavy spinal load resistance designed to forge athletic pulling power.'),
(3, 2, 'High-Intensity Tactical Metcon', 'HIIT', '38 Min', 38, '490 kcal', 490, 'Advanced', 4, 'Full Body, Core, Quads', '4 days ago', FALSE, 'Anaerobic glycolytic intervals paired with loaded functional carries and sprint intervals.'),
(4, 2, 'Savage Squat & Quad Overload', 'Strength', '60 Min', 60, '580 kcal', 580, 'Elite', 5, 'Quads, Glutes, Calves', '6 days ago', FALSE, 'Knee flexion mastery combining raw back squats with deep stretch leg press repetitions.');

-- 5. WORKOUT_EXERCISES SEED
INSERT INTO workout_exercises (workout_id, exercise_id, name, sets, reps, weight, duration, notes, completed) VALUES
-- Exercises for Workout 1
(1, 1, 'Incline Barbell Bench Press', 4, 8, 85.0, 15, 'Paused at chest level on every rep', TRUE),
(1, 2, 'Weighted Ring Dips', 3, 10, 20.0, 10, '+20kg weight belt attached', TRUE),
(1, 3, 'Standing Overhead DB Press', 3, 10, 28.0, 10, 'Controlled eccentric tempo', TRUE),
(1, 4, 'Cable Upper Pec Crossover', 4, 15, 18.0, 10, 'Peak 2-second contraction at midline', TRUE),
(1, 5, 'Overhead Rope Cable Extension', 3, 12, 32.0, 10, 'Full elbow lockout', TRUE),
-- Exercises for Workout 2
(2, 6, 'Conventional Barbell Deadlift', 5, 5, 175.0, 20, 'Hook grip with flat back', TRUE),
(2, 7, 'Chest-Supported T-Bar Row', 4, 8, 70.0, 12, 'Squeeze shoulder blades', TRUE),
(2, 8, 'Romanian Dumbbell Deadlift', 3, 10, 40.0, 12, 'Deep stretch in hamstrings', TRUE),
(2, 9, 'Neutral-Grip Lat Pulldown', 4, 10, 80.0, 10, 'Full range of motion', TRUE),
(2, 10, 'Barbell Pendlay Row', 3, 8, 80.0, 11, 'Strict floor reset', TRUE),
-- Exercises for Workout 3
(3, 12, 'Kettlebell Swing & Burpee Ladder', 5, 20, 28.0, 10, '28kg competition kettlebell', TRUE),
(3, NULL, 'Assault Air Bike Sprints', 8, 1, 0.0, 10, '30s on / 30s off interval structure', TRUE),
(3, NULL, 'Farmers Walk Carries', 4, 60, 36.0, 8, '36kg per hand for 60m', TRUE),
(3, NULL, 'Hanging Knee-to-Elbow Tuck', 4, 15, 0.0, 10, 'Strict hanging core compression', TRUE),
-- Exercises for Workout 4
(4, 11, 'Barbell Back Squat', 5, 5, 145.0, 20, 'Below parallel depth on all sets', TRUE),
(4, NULL, 'Hack Squat 1.5 Rep Sequence', 4, 10, 120.0, 15, 'Bottom half pulse for quad tear', TRUE),
(4, NULL, 'Walking Dumbbell Lunges', 3, 20, 24.0, 10, '24kg DBs in each hand', TRUE),
(4, NULL, 'Seated Leg Curl', 4, 12, 65.0, 8, 'Isolate hamstrings', TRUE),
(4, NULL, 'Standing Calf Raises', 4, 15, 90.0, 7, 'Full stretch at bottom', TRUE);

-- 6. FITNESS_GOALS SEED
INSERT INTO fitness_goals (user_id, title, category, current_val, target_val, unit, deadline, progress, status, notes) VALUES
(2, 'Lean Mass Recomposition', 'Muscle Gain', 78.5, 82.0, 'kg', 'Dec 31, 2026', 68, 'in-progress', 'Targeting 0.3kg clean mass per week with high protein surplus.'),
(2, 'Barbell Bench Press 1RM', 'Strength', 110.0, 125.0, 'kg', 'Nov 15, 2026', 75, 'in-progress', 'Running 5/3/1 BBB cycle with paused repetitions.'),
(2, 'Sub-48m 10K Outdoor Run', 'Endurance', 54.0, 48.0, 'min', 'Nov 30, 2026', 60, 'in-progress', 'Zone 2 aerobic base building combined with weekly track intervals.'),
(2, '20 Strict Bodyweight Pull-ups', 'Strength', 16.0, 20.0, 'reps', 'Oct 31, 2026', 80, 'in-progress', 'Greasing the groove protocol throughout the day.'),
(2, '30-Day Zero Miss Training Habit', 'Habit', 30.0, 30.0, 'days', 'Completed', 100, 'completed', 'Achieved full consistency through dedicated evening sessions.');

-- 7. PROGRESS SEED
INSERT INTO progress (user_id, exercise, weight, reps, body_fat, workout_count, calories_burned, recorded_date, badge, notes) VALUES
(2, 'Barbell Bench Press', '120 kg', 1, 14.5, 68, 38400, 'Yesterday', 'Gold', 'Hit clean 1RM paused rep at gym'),
(2, 'Conventional Deadlift', '190 kg', 1, 14.5, 68, 38400, '3 days ago', 'Diamond', 'New lifetime PR lockout with no hitching'),
(2, 'Barbell Back Squat', '160 kg', 3, 14.6, 67, 37800, 'Last week', 'Gold', 'Triple at solid parallel depth'),
(2, 'Weighted Pull-Up', '+35 kg', 5, 14.8, 65, 36000, '2 weeks ago', 'Silver', 'Strict chin over bar for 5 unbroken reps'),
(2, '5K Outdoor Run', '19m 42s', 1, 15.0, 60, 32000, 'Last month', 'Gold', 'Sub-20 minute breakthrough on flat track');

-- 8. CHALLENGES SEED
INSERT INTO challenges (id, title, category, reward, description, participants, days_left, duration_days, progress, joined, completed, check_ins, required_check_ins, start_date, end_date, target, status) VALUES
(1, 'Century Push-up Blitz', 'Strength', 'Iron Chest Badge', 'Complete 100 perfect push-ups daily for 14 consecutive days. Elevate shoulder and pectoral muscular endurance.', 4120, 5, 14, 82, TRUE, FALSE, 11, 14, '2026-10-01', '2026-10-15', '1400 Push-ups', 'Active'),
(2, 'Sub-20 5K Sprint Series', 'Endurance', 'Aero Runner Trophy', 'Conquer intervals and lower your continuous 5K pace below the 20-minute threshold.', 2890, 12, 30, 45, TRUE, FALSE, 9, 20, '2026-10-01', '2026-10-31', '20 Check-ins', 'Active'),
(3, 'Zero Missed Days: 21-Day Habit', 'Consistency', 'Consistency Crown', 'Log at least 30 active minutes every single day for 3 full weeks with zero breaks.', 6540, 14, 21, 0, FALSE, FALSE, 0, 21, '2026-10-05', '2026-10-26', '21 Check-ins', 'Active'),
(4, 'Heavy Pull 10,000kg Volume', 'Strength', 'Deadlift Titan Gold', 'Accumulate 10 metric tons of total volume pulled (Deadlifts, Barbell Rows, Cleans) in 7 days.', 1980, 8, 7, 0, FALSE, FALSE, 0, 5, '2026-10-10', '2026-10-17', '10,000 kg Volume', 'Active'),
(5, 'Spartan Core & Planking Matrix', 'Core', 'Titanium Abs Pin', 'Accumulate 60 minutes total of isometric plank variations across 10 days.', 3410, 18, 10, 100, TRUE, TRUE, 10, 10, '2026-09-20', '2026-09-30', '10 Check-ins', 'Completed');

-- 9. CHALLENGE_PARTICIPANTS SEED
INSERT INTO challenge_participants (challenge_id, user_id, check_ins, progress, completed, status, joined_at) VALUES
(1, 2, 11, 82, FALSE, 'Active', '2026-10-01 08:00:00'),
(2, 2, 9, 45, FALSE, 'Active', '2026-10-02 09:30:00'),
(5, 2, 10, 100, TRUE, 'Completed', '2026-09-20 07:15:00');

-- 10. FITNESS_CONTENT SEED
INSERT INTO fitness_content (id, title, category, level, status, description, content) VALUES
(1, 'Olympic Weightlifting Foundation', 'Strength', 'Elite', 'Published', 'Clean and snatch progression fundamentals.', 'Step-by-step guidance on bar trajectory, triple extension, and hip mobility drills.'),
(2, 'Hyrox Functional Conditioning', 'HIIT', 'Advanced', 'Published', 'High-volume cardiovascular pacing and sled mechanics.', 'Master the pacing strategy for ski erg, sled push, rowing, and wall balls.'),
(3, 'Post-Run Thoracic & Ankle Recovery', 'Mobility', 'Beginner', 'Published', 'Decompression routines after long distance training.', 'Restorative stretches to alleviate lower back tightness and restore calf elasticity.');

-- 11. SYSTEM_SETTINGS SEED
INSERT INTO system_settings (id, setting_key, setting_value, description) VALUES
(1, 'api_version', '1.0.0', 'Current REST API specification version'),
(2, 'maintenance_mode', 'false', 'Global maintenance mode toggle'),
(3, 'allow_registrations', 'true', 'Allow new athlete registrations in the system'),
(4, 'default_workout_duration', '45', 'Default workout duration in minutes');

-- ==============================================================================
-- END OF SCRIPT
-- ==============================================================================
