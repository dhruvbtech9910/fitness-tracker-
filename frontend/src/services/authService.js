import api from "./api";
import { INITIAL_USER, INITIAL_ADMIN } from "../utils/constants";
import { storage } from "../utils/helpers";

const STORAGE_KEY_USER = "fitpulse_user";
const STORAGE_KEY_TOKEN = "fitpulse_token";

/**
 * Authentication service ready for Spring Boot JWT Authentication
 */
export const authService = {
  /**
   * Log in user with email & password
   */
  async login(email, password, rememberMe = false) {
    try {
      // Prepared for Spring Boot endpoint: POST /api/auth/login
      const response = await api.post("/auth/login", { email, password });
      if (response && response.token) {
        storage.set(STORAGE_KEY_TOKEN, response.token);
        storage.set(STORAGE_KEY_USER, response.user);
        return { success: true, user: response.user };
      }
    } catch {
      // Mock Fallback: simulate authentication locally
      await new Promise((resolve) => setTimeout(resolve, 400)); // realistic network feel
      
      const isAdminLogin = email.toLowerCase().includes("admin");
      const mockUser = isAdminLogin
        ? { ...INITIAL_ADMIN, email }
        : {
            ...INITIAL_USER,
            email,
            name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Athlete User",
          };

      const mockToken = `jwt_mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY_TOKEN, mockToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
      } else {
        sessionStorage.setItem(STORAGE_KEY_TOKEN, mockToken);
        sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(mockUser));
      }
      // Also sync to localStorage for easy persistence across tabs
      storage.set(STORAGE_KEY_TOKEN, mockToken);
      storage.set(STORAGE_KEY_USER, mockUser);

      return { success: true, user: mockUser };
    }
  },

  /**
   * Register a new user
   */
  async register(userData) {
    try {
      // Prepared for Spring Boot endpoint: POST /api/auth/register
      const response = await api.post("/auth/register", userData);
      if (response && response.token) {
        storage.set(STORAGE_KEY_TOKEN, response.token);
        storage.set(STORAGE_KEY_USER, response.user);
        return { success: true, user: response.user };
      }
    } catch {
      // Mock Fallback
      await new Promise((resolve) => setTimeout(resolve, 450));
      const newUser = {
        ...INITIAL_USER,
        id: `usr_${Date.now()}`,
        name: userData.fullName || userData.name || "Athlete",
        email: userData.email,
        fitnessGoal: userData.fitnessGoal || "General Fitness",
        activityLevel: userData.activityLevel || "Moderately Active",
        weight: userData.weight ? parseFloat(userData.weight) : 75,
        targetWeight: userData.targetWeight ? parseFloat(userData.targetWeight) : 78,
      };

      const mockToken = `jwt_mock_${Date.now()}`;
      storage.set(STORAGE_KEY_TOKEN, mockToken);
      storage.set(STORAGE_KEY_USER, newUser);
      return { success: true, user: newUser };
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser() {
    const user = storage.get(STORAGE_KEY_USER);
    if (!user) {
      // Default to initial user so app is immediately interactive without forcing login
      storage.set(STORAGE_KEY_USER, INITIAL_USER);
      return INITIAL_USER;
    }
    return user;
  },

  /**
   * Check if user is logged in
   */
  isAuthenticated() {
    return Boolean(storage.get(STORAGE_KEY_TOKEN) || storage.get(STORAGE_KEY_USER));
  },

  /**
   * Check if current user is an admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user && (user.role === "System Admin" || user.email?.includes("admin"));
  },

  /**
   * Update profile data
   */
  async updateProfile(updates) {
    try {
      const response = await api.put("/users/profile", updates);
      if (response) {
        storage.set(STORAGE_KEY_USER, response);
        return response;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const current = this.getCurrentUser();
      const updated = { ...current, ...updates };
      storage.set(STORAGE_KEY_USER, updated);
      return updated;
    }
  },

  /**
   * Log out user
   */
  logout() {
    storage.remove(STORAGE_KEY_USER);
    storage.remove(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
  },
};

export default authService;
