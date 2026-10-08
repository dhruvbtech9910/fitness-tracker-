import api from "./api";
import { storage, generateId } from "../utils/helpers";

const STORAGE_KEY_WORKOUTS = "fitpulse_workouts";

export const DEFAULT_WORKOUTS = [
  {
    id: "w_1",
    title: "Hypertrophy Push Dominance",
    category: "Strength",
    duration: "55 Min",
    durationMinutes: 55,
    calories: "520 kcal",
    caloriesBurned: 520,
    difficulty: "Intermediate",
    exercisesCount: 5,
    targetMuscles: ["Chest", "Triceps", "Front Delts"],
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isPopular: true,
    description: "High-density hypertrophy sequence prioritizing mechanical tension across incline angles and lockout tricep isolation.",
    exercises: [
      { id: "e1", name: "Incline Barbell Bench Press", sets: 4, reps: 8, weight: 85, duration: 15, completed: true },
      { id: "e2", name: "Weighted Ring Dips", sets: 3, reps: 10, weight: 20, duration: 10, completed: true },
      { id: "e3", name: "Standing Overhead DB Press", sets: 3, reps: 10, weight: 28, duration: 10, completed: true },
      { id: "e4", name: "Cable Upper Pec Crossover", sets: 4, reps: 15, weight: 18, duration: 10, completed: true },
      { id: "e5", name: "Overhead Rope Cable Extension", sets: 3, reps: 12, weight: 32, duration: 10, completed: true },
    ],
  },
  {
    id: "w_2",
    title: "Posterior Chain Deadlift Engine",
    category: "Strength",
    duration: "65 Min",
    durationMinutes: 65,
    calories: "640 kcal",
    caloriesBurned: 640,
    difficulty: "Advanced",
    exercisesCount: 5,
    targetMuscles: ["Hamstrings", "Lats", "Erectors", "Glutes"],
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isPopular: true,
    description: "Pure hinge mechanics and heavy spinal load resistance designed to forge athletic pulling power.",
    exercises: [
      { id: "e6", name: "Conventional Barbell Deadlift", sets: 5, reps: 5, weight: 175, duration: 20, completed: true },
      { id: "e7", name: "Chest-Supported T-Bar Row", sets: 4, reps: 8, weight: 70, duration: 12, completed: true },
      { id: "e8", name: "Romanian Dumbbell Deadlift", sets: 3, reps: 10, weight: 40, duration: 12, completed: true },
      { id: "e9", name: "Neutral-Grip Lat Pulldown", sets: 4, reps: 10, weight: 80, duration: 10, completed: true },
      { id: "e10", name: "Barbell Pendlay Row", sets: 3, reps: 8, weight: 80, duration: 11, completed: true },
    ],
  },
  {
    id: "w_3",
    title: "High-Intensity Tactical Metcon",
    category: "HIIT",
    duration: "38 Min",
    durationMinutes: 38,
    calories: "490 kcal",
    caloriesBurned: 490,
    difficulty: "Advanced",
    exercisesCount: 4,
    targetMuscles: ["Full Body", "Core", "Quads"],
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    isPopular: false,
    description: "Anaerobic glycolytic intervals paired with loaded functional carries and sprint intervals.",
    exercises: [
      { id: "e11", name: "Kettlebell Swing & Burpee Ladder", sets: 5, reps: 20, weight: 28, duration: 10, completed: true },
      { id: "e12", name: "Assault Air Bike Sprints (30s on / 30s off)", sets: 8, reps: 1, weight: 0, duration: 10, completed: true },
      { id: "e13", name: "Farmers Walk Carries", sets: 4, reps: 60, weight: 36, duration: 8, completed: true },
      { id: "e14", name: "Hanging Knee-to-Elbow Tuck", sets: 4, reps: 15, weight: 0, duration: 10, completed: true },
    ],
  },
  {
    id: "w_4",
    title: "Savage Squat & Quad Overload",
    category: "Strength",
    duration: "60 Min",
    durationMinutes: 60,
    calories: "580 kcal",
    caloriesBurned: 580,
    difficulty: "Elite",
    exercisesCount: 5,
    targetMuscles: ["Quads", "Glutes", "Calves"],
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    isPopular: false,
    description: "Knee flexion mastery combining raw back squats with deep stretch leg press repetitions.",
    exercises: [
      { id: "e15", name: "Barbell Back Squat", sets: 5, reps: 5, weight: 145, duration: 20, completed: true },
      { id: "e16", name: "Hack Squat 1.5 Rep Sequence", sets: 4, reps: 10, weight: 120, duration: 15, completed: true },
      { id: "e17", name: "Walking Dumbbell Lunges", sets: 3, reps: 20, weight: 24, duration: 10, completed: true },
      { id: "e18", name: "Seated Leg Curl", sets: 4, reps: 12, weight: 65, duration: 8, completed: true },
      { id: "e19", name: "Standing Calf Raises", sets: 4, reps: 15, weight: 90, duration: 7, completed: true },
    ],
  },
  {
    id: "w_5",
    title: "Mobility & Thoracic Decompression",
    category: "Mobility",
    duration: "30 Min",
    durationMinutes: 30,
    calories: "160 kcal",
    caloriesBurned: 160,
    difficulty: "Beginner",
    exercisesCount: 4,
    targetMuscles: ["Hips", "Spine", "Shoulders"],
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    isPopular: false,
    description: "Joint integrity, hip capsule release, and thoracic mobility protocol for rapid recovery.",
    exercises: [
      { id: "e20", name: "90/90 Hip Flow Transition", sets: 3, reps: 10, weight: 0, duration: 8, completed: true },
      { id: "e21", name: "World's Greatest Stretch", sets: 3, reps: 6, weight: 0, duration: 8, completed: true },
      { id: "e22", name: "Thoracic Foam Roller Extensions", sets: 3, reps: 12, weight: 0, duration: 7, completed: true },
      { id: "e23", name: "Pigeon Pose Hold", sets: 2, reps: 60, weight: 0, duration: 7, completed: true },
    ],
  },
];

export const workoutService = {
  /**
   * Fetch all workouts
   */
  async getWorkouts() {
    try {
      // Prepared for Spring Boot GET /api/workouts
      const data = await api.get("/workouts");
      if (Array.isArray(data)) return data;
    } catch {
      // Local fallback
    }

    const localData = storage.get(STORAGE_KEY_WORKOUTS);
    if (!localData || !localData.length) {
      storage.set(STORAGE_KEY_WORKOUTS, DEFAULT_WORKOUTS);
      return DEFAULT_WORKOUTS;
    }
    return localData;
  },

  /**
   * Get workout by ID
   */
  async getWorkoutById(id) {
    try {
      const data = await api.get(`/workouts/${id}`);
      if (data) return data;
    } catch {
      // fallback
    }
    const all = await this.getWorkouts();
    return all.find((w) => String(w.id) === String(id)) || null;
  },

  /**
   * Create a new workout
   */
  async createWorkout(workout) {
    const newWorkout = {
      ...workout,
      id: workout.id || generateId("w"),
      date: workout.date || new Date().toISOString(),
      duration: workout.duration || `${workout.durationMinutes || 45} Min`,
      durationMinutes: workout.durationMinutes ? parseInt(workout.durationMinutes, 10) : 45,
      calories: workout.calories || `${workout.caloriesBurned || 400} kcal`,
      caloriesBurned: workout.caloriesBurned ? parseInt(workout.caloriesBurned, 10) : 400,
      exercisesCount: workout.exercises?.length || workout.exercisesCount || 4,
      targetMuscles: workout.targetMuscles || ["Full Body"],
    };

    try {
      // Prepared for Spring Boot POST /api/workouts
      const saved = await api.post("/workouts", newWorkout);
      if (saved) return saved;
    } catch {
      // local fallback
    }

    const workouts = await this.getWorkouts();
    const updated = [newWorkout, ...workouts];
    storage.set(STORAGE_KEY_WORKOUTS, updated);
    return newWorkout;
  },

  /**
   * Update existing workout
   */
  async updateWorkout(id, updates) {
    try {
      const saved = await api.put(`/workouts/${id}`, updates);
      if (saved) return saved;
    } catch {
      // local fallback
    }

    const workouts = await this.getWorkouts();
    const index = workouts.findIndex((w) => String(w.id) === String(id));
    if (index !== -1) {
      workouts[index] = { ...workouts[index], ...updates };
      storage.set(STORAGE_KEY_WORKOUTS, workouts);
      return workouts[index];
    }
    return null;
  },

  /**
   * Delete workout by ID
   */
  async deleteWorkout(id) {
    try {
      await api.delete(`/workouts/${id}`);
    } catch {
      // local fallback
    }

    const workouts = await this.getWorkouts();
    const filtered = workouts.filter((w) => String(w.id) !== String(id));
    storage.set(STORAGE_KEY_WORKOUTS, filtered);
    return true;
  },

  /**
   * Get aggregate workout metrics
   */
  async getWorkoutStats() {
    const workouts = await this.getWorkouts();
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + (parseInt(w.durationMinutes || w.duration, 10) || 45), 0);
    const totalCalories = workouts.reduce((sum, w) => sum + (parseInt(w.caloriesBurned || w.calories, 10) || 450), 0);

    return {
      totalWorkouts,
      totalMinutes,
      totalCalories,
      averageCaloriesPerWorkout: totalWorkouts ? Math.round(totalCalories / totalWorkouts) : 0,
      averageDuration: totalWorkouts ? Math.round(totalMinutes / totalWorkouts) : 0,
    };
  },
};

export default workoutService;
