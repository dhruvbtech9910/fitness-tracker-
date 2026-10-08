// Application constants and configuration

export const APP_NAME = "FITPULSE PRO";
export const APP_TAGLINE = "High-Performance Fitness & Strain Operating System";

export const WORKOUT_CATEGORIES = [
  "All",
  "Strength",
  "Cardio",
  "HIIT",
  "Hypertrophy",
  "Mobility",
  "Powerlifting",
  "Calisthenics",
];

export const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Elite",
];

export const GOAL_CATEGORIES = [
  "All",
  "Weight Loss",
  "Muscle Gain",
  "Endurance",
  "Strength",
  "Habit",
];

export const MUSCLE_GROUPS = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Quads",
  "Hamstrings",
  "Glutes",
  "Calves",
  "Core",
  "Full Body",
];

export const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Sedentary", desc: "Little or no exercise, desk job" },
  { id: "light", label: "Lightly Active", desc: "Light exercise 1-3 days/week" },
  { id: "moderate", label: "Moderately Active", desc: "Moderate exercise 3-5 days/week" },
  { id: "very", label: "Very Active", desc: "Hard exercise 6-7 days/week" },
  { id: "athlete", label: "Elite Athlete", desc: "Intense daily training / physical work" },
];

export const USER_ROLES = {
  USER: "Athlete",
  ADMIN: "System Admin",
  TRAINER: "Coach",
};

export const INITIAL_USER = {
  id: "usr_001",
  name: "Alex Vance",
  email: "alex.vance@fitpulse.pro",
  role: "Athlete",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  fitnessGoal: "Hypertrophy & Athletic Conditioning",
  activityLevel: "Very Active",
  weight: 78.5, // kg
  targetWeight: 82.0, // kg
  height: 181, // cm
  age: 26,
  activeStreak: 14,
  workoutsCompleted: 68,
  totalCaloriesBurned: 38400,
  joinedDate: "January 2026",
  membershipTier: "Pro Athlete",
};

export const INITIAL_ADMIN = {
  id: "admin_001",
  name: "Marcus Thorne",
  email: "admin@fitpulse.pro",
  role: "System Admin",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
};

export const MOCK_PR_RECORDS = [
  { id: "pr_1", exercise: "Barbell Bench Press", weight: "120 kg", reps: 1, date: "Yesterday", badge: "Gold" },
  { id: "pr_2", exercise: "Conventional Deadlift", weight: "190 kg", reps: 1, date: "3 days ago", badge: "Diamond" },
  { id: "pr_3", exercise: "Barbell Back Squat", weight: "160 kg", reps: 3, date: "Last week", badge: "Gold" },
  { id: "pr_4", exercise: "Weighted Pull-Up", weight: "+35 kg", reps: 5, date: "2 weeks ago", badge: "Silver" },
  { id: "pr_5", exercise: "5K Outdoor Run", weight: "19m 42s", reps: 1, date: "Last month", badge: "Gold" },
];
