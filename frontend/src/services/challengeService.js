import api from "./api";
import { storage, generateId } from "../utils/helpers";

const STORAGE_KEY_CHALLENGES = "fitpulse_challenges";

export const DEFAULT_CHALLENGES = [
  {
    id: "c_1",
    title: "Century Push-up Blitz",
    category: "Strength",
    reward: "Iron Chest Badge",
    description: "Complete 100 perfect push-ups daily for 14 consecutive days. Elevate shoulder and pectoral muscular endurance.",
    participants: 4120,
    daysLeft: 5,
    durationDays: 14,
    progress: 82,
    joined: true,
    completed: false,
    checkIns: 11,
    requiredCheckIns: 14,
  },
  {
    id: "c_2",
    title: "Sub-20 5K Sprint Series",
    category: "Endurance",
    reward: "Aero Runner Trophy",
    description: "Conquer intervals and lower your continuous 5K pace below the 20-minute threshold.",
    participants: 2890,
    daysLeft: 12,
    durationDays: 30,
    progress: 45,
    joined: true,
    completed: false,
    checkIns: 9,
    requiredCheckIns: 20,
  },
  {
    id: "c_3",
    title: "Zero Missed Days: 21-Day Habit",
    category: "Consistency",
    reward: "Consistency Crown",
    description: "Log at least 30 active minutes every single day for 3 full weeks with zero breaks.",
    participants: 6540,
    daysLeft: 14,
    durationDays: 21,
    progress: 0,
    joined: false,
    completed: false,
    checkIns: 0,
    requiredCheckIns: 21,
  },
  {
    id: "c_4",
    title: "Heavy Pull 10,000kg Volume",
    category: "Strength",
    reward: "Deadlift Titan Gold",
    description: "Accumulate 10 metric tons of total volume pulled (Deadlifts, Barbell Rows, Cleans) in 7 days.",
    participants: 1980,
    daysLeft: 8,
    durationDays: 7,
    progress: 0,
    joined: false,
    completed: false,
    checkIns: 0,
    requiredCheckIns: 5,
  },
  {
    id: "c_5",
    title: "Spartan Core & Planking Matrix",
    category: "Core",
    reward: "Titanium Abs Pin",
    description: "Accumulate 60 minutes total of isometric plank variations across 10 days.",
    participants: 3410,
    daysLeft: 18,
    durationDays: 10,
    progress: 100,
    joined: true,
    completed: true,
    checkIns: 10,
    requiredCheckIns: 10,
  },
];

export const challengeService = {
  /**
   * Get all challenges
   */
  async getChallenges() {
    try {
      const data = await api.get("/challenges");
      if (Array.isArray(data)) return data;
    } catch {
      // local fallback
    }

    const localData = storage.get(STORAGE_KEY_CHALLENGES);
    if (!localData || !localData.length) {
      storage.set(STORAGE_KEY_CHALLENGES, DEFAULT_CHALLENGES);
      return DEFAULT_CHALLENGES;
    }
    return localData;
  },

  /**
   * Join a challenge
   */
  async joinChallenge(id) {
    try {
      await api.post(`/challenges/${id}/join`);
    } catch {
      // local fallback
    }

    const challenges = await this.getChallenges();
    const updated = challenges.map((c) =>
      String(c.id) === String(id)
        ? { ...c, joined: true, participants: c.participants + 1, progress: c.progress || 5 }
        : c
    );
    storage.set(STORAGE_KEY_CHALLENGES, updated);
    return updated.find((c) => String(c.id) === String(id));
  },

  /**
   * Check in / submit progress to challenge
   */
  async checkInChallenge(id) {
    try {
      await api.post(`/challenges/${id}/checkin`);
    } catch {
      // local fallback
    }

    const challenges = await this.getChallenges();
    const updated = challenges.map((c) => {
      if (String(c.id) === String(id)) {
        const nextCheckIn = (c.checkIns || 0) + 1;
        const required = c.requiredCheckIns || 14;
        const newProgress = Math.min(Math.round((nextCheckIn / required) * 100), 100);
        return {
          ...c,
          checkIns: nextCheckIn,
          progress: newProgress,
          completed: newProgress >= 100,
        };
      }
      return c;
    });
    storage.set(STORAGE_KEY_CHALLENGES, updated);
    return updated.find((c) => String(c.id) === String(id));
  },

  /**
   * Admin: create new challenge
   */
  async createChallenge(challenge) {
    const newChallenge = {
      ...challenge,
      id: challenge.id || generateId("c"),
      participants: 1,
      progress: 0,
      joined: false,
      completed: false,
      checkIns: 0,
      requiredCheckIns: challenge.durationDays || 14,
    };

    try {
      const saved = await api.post("/challenges", newChallenge);
      if (saved) return saved;
    } catch {
      // fallback
    }

    const challenges = await this.getChallenges();
    const updated = [newChallenge, ...challenges];
    storage.set(STORAGE_KEY_CHALLENGES, updated);
    return newChallenge;
  },

  /**
   * Admin: delete challenge
   */
  async deleteChallenge(id) {
    try {
      await api.delete(`/challenges/${id}`);
    } catch {
      // fallback
    }

    const challenges = await this.getChallenges();
    const filtered = challenges.filter((c) => String(c.id) !== String(id));
    storage.set(STORAGE_KEY_CHALLENGES, filtered);
    return true;
  },
};

export default challengeService;
