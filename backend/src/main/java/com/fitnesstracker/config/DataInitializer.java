package com.fitnesstracker.config;

import com.fitnesstracker.entity.*;
import com.fitnesstracker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * DataInitializer
 * Seeds initial users, workouts, goals, and challenges when database is newly initialized.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Autowired
    private FitnessGoalRepository goalRepository;

    @Autowired
    private ChallengeRepository challengeRepository;

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private FitnessContentRepository contentRepository;

    @Autowired
    private SystemSettingRepository settingRepository;

    @Autowired
    private ExerciseRepository exerciseRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedRoles();
        seedExercises();
        seedUsers();
        seedWorkouts();
        seedGoals();
        seedChallenges();
        seedProgress();
        seedContent();
        seedSettings();
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role("Athlete", "Standard athlete user role"));
            roleRepository.save(new Role("System Admin", "Administrative role with full privileges"));
            roleRepository.save(new Role("Coach", "Trainer role for supervising routines"));
        }
    }

    private void seedExercises() {
        if (exerciseRepository.count() == 0) {
            exerciseRepository.save(new Exercise("Incline Barbell Bench Press", "Chest", "Upper Pecs", "Intermediate", "Incline pressing to target clavicular pectoralis fibers"));
            exerciseRepository.save(new Exercise("Weighted Ring Dips", "Chest", "Lower Pecs & Triceps", "Advanced", "Suspended dip variation challenging shoulder stabilization"));
            exerciseRepository.save(new Exercise("Standing Overhead DB Press", "Shoulders", "Anterior & Lateral Delts", "Intermediate", "Vertical shoulder press for unilateral balance"));
            exerciseRepository.save(new Exercise("Cable Upper Pec Crossover", "Chest", "Inner Pecs", "Beginner", "Constant mechanical tension through horizontal adduction"));
            exerciseRepository.save(new Exercise("Overhead Rope Cable Extension", "Triceps", "Triceps Long Head", "Beginner", "Overhead tricep extension for maximum stretch"));
            exerciseRepository.save(new Exercise("Conventional Barbell Deadlift", "Back", "Posterior Chain & Hamstrings", "Advanced", "Foundational compound hinge movement from floor"));
            exerciseRepository.save(new Exercise("Chest-Supported T-Bar Row", "Back", "Rhomboids & Mid-Back", "Intermediate", "Heavy rowing with strict lumbar support"));
            exerciseRepository.save(new Exercise("Romanian Dumbbell Deadlift", "Legs", "Hamstrings & Glutes", "Intermediate", "Eccentric hamstring loading with strict pelvic hinge"));
            exerciseRepository.save(new Exercise("Neutral-Grip Lat Pulldown", "Back", "Latissimus Dorsi", "Beginner", "Vertical pulling movement for back lat width"));
            exerciseRepository.save(new Exercise("Barbell Pendlay Row", "Back", "Upper Back & Lats", "Advanced", "Dead-stop explosive barbell row from floor"));
            exerciseRepository.save(new Exercise("Barbell Back Squat", "Legs", "Quadriceps & Glutes", "Advanced", "Foundational lower body knee flexion powerhouse"));
            exerciseRepository.save(new Exercise("Kettlebell Swing & Burpee Ladder", "Full Body", "Full Body & Core", "Advanced", "Anaerobic metabolic conditioning complex"));
        }
    }

    private void seedUsers() {
        // Seed default Admin if not present
        if (!userRepository.existsByEmail("admin@fitpulse.pro")) {
            User admin = new User();
            admin.setName("Marcus Thorne");
            admin.setEmail("admin@fitpulse.pro");
            admin.setPassword(passwordEncoder.encode("admin123")); // Hashed password
            admin.setRole("System Admin");
            admin.setStatus("Active");
            admin.setActiveStreak(45);
            admin.setWorkoutsCompleted(210);
            admin.setTotalCaloriesBurned(105000);
            admin.setMembershipTier("System Admin");
            admin.setJoinedDate("December 2025");
            admin.setAvatar("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80");
            userRepository.save(admin);
        }

        // Seed default User/Athlete if not present
        if (!userRepository.existsByEmail("alex.vance@fitpulse.pro")) {
            User user = new User();
            user.setName("Alex Vance");
            user.setEmail("alex.vance@fitpulse.pro");
            user.setPassword(passwordEncoder.encode("user123")); // Hashed password
            user.setRole("Athlete");
            user.setStatus("Active");
            user.setFitnessGoal("Hypertrophy & Athletic Conditioning");
            user.setActivityLevel("Very Active");
            user.setWeight(78.5);
            user.setTargetWeight(82.0);
            user.setHeight(181.0);
            user.setAge(26);
            user.setActiveStreak(14);
            user.setWorkoutsCompleted(68);
            user.setTotalCaloriesBurned(38400);
            user.setMembershipTier("Pro Athlete");
            user.setJoinedDate("January 2026");
            user.setAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80");
            userRepository.save(user);
        }

        // Seed second demo User if not present
        if (!userRepository.existsByEmail("user@example.com")) {
            User demoUser = new User();
            demoUser.setName("John Doe");
            demoUser.setEmail("user@example.com");
            demoUser.setPassword(passwordEncoder.encode("user123")); // Hashed password
            demoUser.setRole("Athlete");
            demoUser.setStatus("Active");
            demoUser.setFitnessGoal("General Fitness & Fat Loss");
            demoUser.setActivityLevel("Moderately Active");
            demoUser.setWeight(75.0);
            demoUser.setTargetWeight(73.0);
            demoUser.setHeight(178.0);
            demoUser.setAge(28);
            demoUser.setActiveStreak(7);
            demoUser.setWorkoutsCompleted(24);
            demoUser.setTotalCaloriesBurned(12500);
            demoUser.setMembershipTier("Pro Athlete");
            demoUser.setJoinedDate("February 2026");
            demoUser.setAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80");
            userRepository.save(demoUser);
        }
    }

    private void seedWorkouts() {
        if (workoutRepository.count() == 0) {
            User user = userRepository.findByEmail("alex.vance@fitpulse.pro").orElse(null);

            // Workout 1
            Workout w1 = new Workout();
            w1.setTitle("Hypertrophy Push Dominance");
            w1.setCategory("Strength");
            w1.setDuration("55 Min");
            w1.setDurationMinutes(55);
            w1.setCalories("520 kcal");
            w1.setCaloriesBurned(520);
            w1.setDifficulty("Intermediate");
            w1.setExercisesCount(5);
            w1.setTargetMuscles("Chest, Triceps, Front Delts");
            w1.setDate("Yesterday");
            w1.setIsPopular(true);
            w1.setDescription("High-density hypertrophy sequence prioritizing mechanical tension across incline angles.");
            w1.setUser(user);

            w1.addExercise(new WorkoutExercise("Incline Barbell Bench Press", 4, 8, 85.0, 15, true));
            w1.addExercise(new WorkoutExercise("Weighted Ring Dips", 3, 10, 20.0, 10, true));
            w1.addExercise(new WorkoutExercise("Standing Overhead DB Press", 3, 10, 28.0, 10, true));
            w1.addExercise(new WorkoutExercise("Cable Upper Pec Crossover", 4, 15, 18.0, 10, true));
            w1.addExercise(new WorkoutExercise("Overhead Rope Cable Extension", 3, 12, 32.0, 10, true));
            workoutRepository.save(w1);

            // Workout 2
            Workout w2 = new Workout();
            w2.setTitle("Posterior Chain Deadlift Engine");
            w2.setCategory("Strength");
            w2.setDuration("65 Min");
            w2.setDurationMinutes(65);
            w2.setCalories("640 kcal");
            w2.setCaloriesBurned(640);
            w2.setDifficulty("Advanced");
            w2.setExercisesCount(5);
            w2.setTargetMuscles("Hamstrings, Lats, Erectors, Glutes");
            w2.setDate("2 days ago");
            w2.setIsPopular(true);
            w2.setDescription("Pure hinge mechanics and heavy spinal load resistance designed to forge athletic pulling power.");
            w2.setUser(user);

            w2.addExercise(new WorkoutExercise("Conventional Barbell Deadlift", 5, 5, 175.0, 20, true));
            w2.addExercise(new WorkoutExercise("Chest-Supported T-Bar Row", 4, 8, 70.0, 12, true));
            w2.addExercise(new WorkoutExercise("Romanian Dumbbell Deadlift", 3, 10, 40.0, 12, true));
            w2.addExercise(new WorkoutExercise("Neutral-Grip Lat Pulldown", 4, 10, 80.0, 10, true));
            w2.addExercise(new WorkoutExercise("Barbell Pendlay Row", 3, 8, 80.0, 11, true));
            workoutRepository.save(w2);

            // Workout 3
            Workout w3 = new Workout();
            w3.setTitle("High-Intensity Tactical Metcon");
            w3.setCategory("HIIT");
            w3.setDuration("38 Min");
            w3.setDurationMinutes(38);
            w3.setCalories("490 kcal");
            w3.setCaloriesBurned(490);
            w3.setDifficulty("Advanced");
            w3.setExercisesCount(4);
            w3.setTargetMuscles("Full Body, Core, Quads");
            w3.setDate("4 days ago");
            w3.setIsPopular(false);
            w3.setDescription("Anaerobic glycolytic intervals paired with loaded functional carries and sprint intervals.");
            w3.setUser(user);

            w3.addExercise(new WorkoutExercise("Kettlebell Swing & Burpee Ladder", 5, 20, 28.0, 10, true));
            w3.addExercise(new WorkoutExercise("Assault Air Bike Sprints", 8, 1, 0.0, 10, true));
            w3.addExercise(new WorkoutExercise("Farmers Walk Carries", 4, 60, 36.0, 8, true));
            w3.addExercise(new WorkoutExercise("Hanging Knee-to-Elbow Tuck", 4, 15, 0.0, 10, true));
            workoutRepository.save(w3);
        }
    }

    private void seedGoals() {
        if (goalRepository.count() == 0) {
            User user = userRepository.findByEmail("alex.vance@fitpulse.pro").orElse(null);

            FitnessGoal g1 = new FitnessGoal("Lean Mass Recomposition", "Muscle Gain", 78.5, 82.0, "kg", "Dec 31, 2026", "Targeting clean mass per week.");
            g1.setUser(user);
            g1.setProgress(68);
            g1.setStatus("in-progress");
            goalRepository.save(g1);

            FitnessGoal g2 = new FitnessGoal("Barbell Bench Press 1RM", "Strength", 110.0, 125.0, "kg", "Nov 15, 2026", "Running 5/3/1 BBB cycle.");
            g2.setUser(user);
            g2.setProgress(75);
            g2.setStatus("in-progress");
            goalRepository.save(g2);

            FitnessGoal g3 = new FitnessGoal("Sub-48m 10K Outdoor Run", "Endurance", 54.0, 48.0, "min", "Nov 30, 2026", "Zone 2 aerobic base building.");
            g3.setUser(user);
            g3.setProgress(60);
            g3.setStatus("in-progress");
            goalRepository.save(g3);

            FitnessGoal g4 = new FitnessGoal("20 Strict Bodyweight Pull-ups", "Strength", 16.0, 20.0, "reps", "Oct 31, 2026", "Greasing the groove protocol.");
            g4.setUser(user);
            g4.setProgress(80);
            g4.setStatus("in-progress");
            goalRepository.save(g4);

            FitnessGoal g5 = new FitnessGoal("30-Day Zero Miss Training Habit", "Habit", 30.0, 30.0, "days", "Completed", "Achieved full consistency.");
            g5.setUser(user);
            g5.setProgress(100);
            g5.setStatus("completed");
            goalRepository.save(g5);
        }
    }

    private void seedChallenges() {
        if (challengeRepository.count() == 0) {
            Challenge c1 = new Challenge("Century Push-up Blitz", "Strength", "Iron Chest Badge",
                    "Complete 100 perfect push-ups daily for 14 consecutive days.", 14, 14);
            c1.setParticipants(4120);
            c1.setDaysLeft(5);
            c1.setProgress(82);
            c1.setJoined(true);
            c1.setCompleted(false);
            c1.setCheckIns(11);
            challengeRepository.save(c1);

            Challenge c2 = new Challenge("Sub-20 5K Sprint Series", "Endurance", "Aero Runner Trophy",
                    "Conquer intervals and lower your continuous 5K pace below 20-min.", 30, 20);
            c2.setParticipants(2890);
            c2.setDaysLeft(12);
            c2.setProgress(45);
            c2.setJoined(true);
            c2.setCompleted(false);
            c2.setCheckIns(9);
            challengeRepository.save(c2);

            Challenge c3 = new Challenge("Zero Missed Days: 21-Day Habit", "Consistency", "Consistency Crown",
                    "Log at least 30 active minutes every single day for 3 full weeks.", 21, 21);
            c3.setParticipants(6540);
            c3.setDaysLeft(14);
            c3.setProgress(0);
            c3.setJoined(false);
            c3.setCompleted(false);
            c3.setCheckIns(0);
            challengeRepository.save(c3);

            Challenge c4 = new Challenge("Heavy Pull 10,000kg Volume", "Strength", "Deadlift Titan Gold",
                    "Accumulate 10 metric tons of total volume pulled in 7 days.", 7, 5);
            c4.setParticipants(1980);
            c4.setDaysLeft(8);
            c4.setProgress(0);
            c4.setJoined(false);
            c4.setCompleted(false);
            c4.setCheckIns(0);
            challengeRepository.save(c4);

            Challenge c5 = new Challenge("Spartan Core & Planking Matrix", "Core", "Titanium Abs Pin",
                    "Accumulate 60 minutes total of isometric plank variations across 10 days.", 10, 10);
            c5.setParticipants(3410);
            c5.setDaysLeft(18);
            c5.setProgress(100);
            c5.setJoined(true);
            c5.setCompleted(true);
            c5.setCheckIns(10);
            challengeRepository.save(c5);
        }
    }

    private void seedProgress() {
        if (progressRepository.count() == 0) {
            User user = userRepository.findByEmail("alex.vance@fitpulse.pro").orElse(null);

            List<Progress> list = Arrays.asList(
                    new Progress("Barbell Bench Press", "120 kg", 1, "Yesterday", "Gold"),
                    new Progress("Conventional Deadlift", "190 kg", 1, "3 days ago", "Diamond"),
                    new Progress("Barbell Back Squat", "160 kg", 3, "Last week", "Gold"),
                    new Progress("Weighted Pull-Up", "+35 kg", 5, "2 weeks ago", "Silver"),
                    new Progress("5K Outdoor Run", "19m 42s", 1, "Last month", "Gold")
            );

            for (Progress p : list) {
                p.setUser(user);
                progressRepository.save(p);
            }
        }
    }

    private void seedContent() {
        if (contentRepository.count() == 0) {
            contentRepository.save(new FitnessContent("Olympic Weightlifting Foundation", "Strength", "Elite", "Published", "Clean and snatch progression fundamentals."));
            contentRepository.save(new FitnessContent("Hyrox Functional Conditioning", "HIIT", "Advanced", "Published", "High-volume cardiovascular pacing and sled mechanics."));
            contentRepository.save(new FitnessContent("Post-Run Thoracic & Ankle Recovery", "Mobility", "Beginner", "Published", "Decompression routines after long distance training."));
        }
    }

    private void seedSettings() {
        if (settingRepository.count() == 0) {
            settingRepository.save(new SystemSetting("api_version", "1.0.0", "Current REST API specification version"));
            settingRepository.save(new SystemSetting("maintenance_mode", "false", "Global maintenance toggle"));
            settingRepository.save(new SystemSetting("allow_registrations", "true", "Allow new athlete registrations"));
        }
    }
}
