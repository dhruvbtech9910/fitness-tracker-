import api from "./api";
import { storage, generateId } from "../utils/helpers";

const STORAGE_KEY_GOALS = "fitpulse_goals";

export const DEFAULT_GOALS = [
  {
    id: "g_1",
    title: "Lean Mass Recomposition",
    category: "Muscle Gain",
    current: 78.5,
    target: 82.0,
    unit: "kg",
    deadline: "Dec 31, 2026",
    progress: 68,
    status: "in-progress",
    notes: "Targeting 0.3kg clean mass per week with high protein surplus.",
  },
  {
    id: "g_2",
    title: "Barbell Bench Press 1RM",
    category: "Strength",
    current: 110,
    target: 125,
    unit: "kg",
    deadline: "Nov 15, 2026",
    progress: 75,
    status: "in-progress",
    notes: "Running 5/3/1 BBB cycle with paused repetitions.",
  },
  {
    id: "g_3",
    title: "Sub-48m 10K Outdoor Run",
    category: "Endurance",
    current: 54,
    target: 48,
    unit: "min",
    deadline: "Nov 30, 2026",
    progress: 60,
    status: "in-progress",
    notes: "Zone 2 aerobic base building combined with weekly track intervals.",
  },
  {
    id: "g_4",
    title: "20 Strict Bodyweight Pull-ups",
    category: "Strength",
    current: 16,
    target: 20,
    unit: "reps",
    deadline: "Oct 31, 2026",
    progress: 80,
    status: "in-progress",
    notes: "Greasing the groove protocol throughout the day.",
  },
  {
    id: "g_5",
    title: "30-Day Zero Miss Training Habit",
    category: "Habit",
    current: 30,
    target: 30,
    unit: "days",
    deadline: "Completed",
    progress: 100,
    status: "completed",
    notes: "Achieved full consistency through dedicated evening sessions.",
  },
];

export const goalService = {
  /**
   * Get all goals
   */
  async getGoals() {
    try {
      const data = await api.get("/goals");
      if (Array.isArray(data)) return data;
    } catch {
      // local fallback
    }

    const localData = storage.get(STORAGE_KEY_GOALS);
    if (!localData || !localData.length) {
      storage.set(STORAGE_KEY_GOALS, DEFAULT_GOALS);
      return DEFAULT_GOALS;
    }
    return localData;
  },

  /**
   * Create new goal
   */
  async createGoal(goal) {
    const currentVal = parseFloat(goal.current) || 0;
    const targetVal = parseFloat(goal.target) || 100;
    const computedProgress = Math.min(
      Math.max(Math.round((currentVal / (targetVal || 1)) * 100), 0),
      100
    );

    const newGoal = {
      ...goal,
      id: goal.id || generateId("g"),
      current: currentVal,
      target: targetVal,
      progress: goal.progress !== undefined ? goal.progress : computedProgress,
      status: computedProgress >= 100 ? "completed" : "in-progress",
      deadline: goal.deadline || "In 30 days",
    };

    try {
      const saved = await api.post("/goals", newGoal);
      if (saved) return saved;
    } catch {
      // local fallback
    }

    const goals = await this.getGoals();
    const updated = [newGoal, ...goals];
    storage.set(STORAGE_KEY_GOALS, updated);
    return newGoal;
  },

  /**
   * Update goal
   */
  async updateGoal(id, updates) {
    try {
      const saved = await api.put(`/goals/${id}`, updates);
      if (saved) return saved;
    } catch {
      // local fallback
    }

    const goals = await this.getGoals();
    const index = goals.findIndex((g) => String(g.id) === String(id));
    if (index !== -1) {
      const existing = goals[index];
      const merged = { ...existing, ...updates };

      // Recalculate progress if current or target changed
      if (updates.current !== undefined || updates.target !== undefined) {
        const c = parseFloat(merged.current) || 0;
        const t = parseFloat(merged.target) || 1;
        merged.progress = Math.min(Math.max(Math.round((c / t) * 100), 0), 100);
        merged.status = merged.progress >= 100 ? "completed" : "in-progress";
      }

      goals[index] = merged;
      storage.set(STORAGE_KEY_GOALS, goals);
      return merged;
    }
    return null;
  },

  /**
   * Delete goal
   */
  async deleteGoal(id) {
    try {
      await api.delete(`/goals/${id}`);
    } catch {
      // local fallback
    }

    const goals = await this.getGoals();
    const filtered = goals.filter((g) => String(g.id) !== String(id));
    storage.set(STORAGE_KEY_GOALS, filtered);
    return true;
  },
};

export default goalService;
