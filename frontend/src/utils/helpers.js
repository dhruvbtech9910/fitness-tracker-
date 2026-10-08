// Utility helper functions

/**
 * Safe local storage reader with JSON parsing
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading localStorage key "${key}":`, e);
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing to localStorage key "${key}":`, e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  },
};

/**
 * Format a date string into readable format (e.g. "Oct 12, 2026")
 */
export const formatDate = (dateString) => {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Relative date description (e.g. "Today", "Yesterday", "2 days ago")
 */
export const formatRelativeDate = (dateString) => {
  if (!dateString) return "Today";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return formatDate(dateString);
};

/**
 * Calculates 1 Rep Max using Brzycki formula
 * Formula: Weight × (36 / (37 - Reps))
 */
export const calculateOneRepMax = (weight, reps) => {
  const w = parseFloat(weight);
  const r = parseInt(reps, 10);
  if (!w || !r || r < 1) return 0;
  if (r === 1) return Math.round(w);
  if (r > 36) return Math.round(w * 1.5);
  return Math.round(w * (36 / (37 - r)));
};

/**
 * Calculate BMI
 * BMI = weight (kg) / [height (m)]^2
 */
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return { bmi: 0, status: "Unknown", color: "text-zinc-400" };
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let status = "Normal";
  let color = "text-emerald-400";
  if (bmi < 18.5) {
    status = "Underweight";
    color = "text-amber-400";
  } else if (bmi >= 25 && bmi < 29.9) {
    status = "Overweight";
    color = "text-amber-400";
  } else if (bmi >= 30) {
    status = "Obese";
    color = "text-rose-400";
  }

  return { bmi, status, color };
};

/**
 * Estimate daily maintenance calories based on Mifflin-St Jeor
 */
export const calculateBMR = (weightKg, heightCm, age, gender = "male") => {
  if (!weightKg || !heightCm || !age) return 2200;
  // BMR = 10W + 6.25H - 5A + 5 (male) or - 161 (female)
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? Math.round(base + 5) : Math.round(base - 161);
};

/**
 * Format numbers with thousands separators (e.g. 12,450)
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/**
 * Unique ID generator for mock entities
 */
export const generateId = (prefix = "item") => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
};
