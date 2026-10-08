import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Target,
  Activity,
  Flame,
  Dumbbell,
  Scale,
  Calendar,
  Shield,
  Settings,
  LogOut,
  Pencil,
  CheckCircle2,
  X,
  Bell,
  Smartphone,
  Sparkles,
  Zap,
} from "lucide-react";
import Button from "../components/Button";
import authService from "../services/authService";
import { calculateBMI, calculateBMR, formatNumber } from "../utils/helpers";
import { GOAL_CATEGORIES, ACTIVITY_LEVELS } from "../utils/constants";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formName, setFormName] = useState(user?.name || "");
  const [formEmail, setFormEmail] = useState(user?.email || "");
  const [formGoal, setFormGoal] = useState(user?.fitnessGoal || "Hypertrophy & Athletic Conditioning");
  const [formActivity, setFormActivity] = useState(user?.activityLevel || "Very Active");
  const [formWeight, setFormWeight] = useState(user?.weight || 78.5);
  const [formTargetWeight, setFormTargetWeight] = useState(user?.targetWeight || 82.0);
  const [formHeight, setFormHeight] = useState(user?.height || 181);
  const [formAge, setFormAge] = useState(user?.age || 26);

  // Preferences toggles
  const [weightUnit, setWeightUnit] = useState("kg"); // "kg" | "lbs"
  const [notifWorkout, setNotifWorkout] = useState(true);
  const [notifStreak, setNotifStreak] = useState(true);
  const [syncAppleHealth, setSyncAppleHealth] = useState(true);
  const [syncGarmin, setSyncGarmin] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const bmiInfo = calculateBMI(user?.weight || 78.5, user?.height || 181);
  const bmrValue = calculateBMR(user?.weight || 78.5, user?.height || 181, user?.age || 26);

  const handleOpenEditModal = () => {
    setFormName(user?.name || "");
    setFormEmail(user?.email || "");
    setFormGoal(user?.fitnessGoal || "Hypertrophy & Athletic Conditioning");
    setFormActivity(user?.activityLevel || "Very Active");
    setFormWeight(user?.weight || 78.5);
    setFormTargetWeight(user?.targetWeight || 82.0);
    setFormHeight(user?.height || 181);
    setFormAge(user?.age || 26);
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    const updates = {
      name: formName,
      email: formEmail,
      fitnessGoal: formGoal,
      activityLevel: formActivity,
      weight: parseFloat(formWeight) || 75,
      targetWeight: parseFloat(formTargetWeight) || 80,
      height: parseFloat(formHeight) || 180,
      age: parseInt(formAge, 10) || 25,
    };

    const updated = await authService.updateProfile(updates);
    setUser(updated);
    setEditModalOpen(false);
    showToast("Profile updated successfully!");
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleResetData = () => {
    if (window.confirm("Reset training data back to initial seeds?")) {
      localStorage.removeItem("fitpulse_workouts");
      localStorage.removeItem("fitpulse_goals");
      localStorage.removeItem("fitpulse_challenges");
      showToast("Training cache reset to factory defaults.");
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#b8ff32] px-4 py-3 text-xs font-black text-[#070908] shadow-2xl animate-in slide-in-from-bottom-4">
          <CheckCircle2 size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ATHLETE PROFILE HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c130e] via-[#090d0b] to-[#070908] p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#b8ff32]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80"}
                alt="Avatar"
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover border-2 border-white/15 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-400 border-3 border-[#070908]" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  {user?.name || "Alex Vance"}
                </h1>
                <span className="rounded-full bg-[#b8ff32]/20 border border-[#b8ff32]/40 px-2.5 py-0.5 text-[9px] font-black uppercase text-[#b8ff32]">
                  {user?.membershipTier || "Pro Athlete"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium mt-1">
                {user?.email || "athlete@fitpulse.pro"} • Member since {user?.joinedDate || "January 2026"}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-1.5">
                  <Target size={14} className="text-[#b8ff32]" />
                  {user?.fitnessGoal || "Hypertrophy"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Activity size={14} className="text-emerald-400" />
                  {user?.activityLevel || "Very Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="md"
              icon={Pencil}
              iconPosition="left"
              onClick={handleOpenEditModal}
            >
              Edit Profile
            </Button>
            <Button
              variant="danger"
              size="md"
              icon={LogOut}
              iconPosition="left"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* 2. BIOMETRIC & METABOLIC TELEMETRY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Scale size={16} className="text-[#b8ff32]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Current Weight
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">
              {user?.weight || 78.5}
            </span>
            <span className="text-xs font-bold uppercase text-zinc-400">kg</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">
            Target: {user?.targetWeight || 82.0} kg
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Activity size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Body Mass Index
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">
              {bmiInfo.bmi}
            </span>
            <span className={`text-xs font-bold uppercase ${bmiInfo.color}`}>
              {bmiInfo.status}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">
            Height: {user?.height || 181} cm
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Flame size={16} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Basal Metabolic (BMR)
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">
              {bmrValue}
            </span>
            <span className="text-xs font-bold uppercase text-zinc-400">kcal</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">
            Resting expenditure
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Zap size={16} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Maintenance TDEE
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">
              {Math.round(bmrValue * 1.55)}
            </span>
            <span className="text-xs font-bold uppercase text-zinc-400">kcal</span>
          </div>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">
            Target daily intake
          </p>
        </div>
      </div>

      {/* 3. LIFETIME ATHLETE MILESTONES & STATS */}
      <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 sm:p-8 backdrop-blur-xl">
        <h2 className="text-lg font-black uppercase tracking-tight text-white mb-6 flex items-center gap-2">
          <Sparkles size={18} className="text-[#b8ff32]" />
          Lifetime Performance Ledger
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="border-l-2 border-[#b8ff32] pl-4">
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {user?.workoutsCompleted || 68}
            </span>
            <span className="text-xs font-bold uppercase text-zinc-400">
              Sessions Completed
            </span>
          </div>

          <div className="border-l-2 border-emerald-400 pl-4">
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {formatNumber(user?.totalCaloriesBurned || 38400)}
            </span>
            <span className="text-xs font-bold uppercase text-zinc-400">
              Total Calories Burned
            </span>
          </div>

          <div className="border-l-2 border-amber-400 pl-4">
            <span className="text-2xl sm:text-3xl font-black text-white block">
              {user?.activeStreak || 14} Days
            </span>
            <span className="text-xs font-bold uppercase text-zinc-400">
              Peak Consistency Streak
            </span>
          </div>

          <div className="border-l-2 border-sky-400 pl-4">
            <span className="text-2xl sm:text-3xl font-black text-white block">
              100%
            </span>
            <span className="text-xs font-bold uppercase text-zinc-400">
              Data Cloud Sync SLA
            </span>
          </div>
        </div>
      </div>

      {/* 4. SETTINGS & INTEGRATIONS ROW */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Account & Notification Preferences */}
        <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 backdrop-blur-xl space-y-5">
          <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Settings size={18} className="text-[#b8ff32]" />
            Session Preferences
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Weight Unit Metric
                </span>
                <span className="text-[11px] text-zinc-400">
                  Switch between Kilograms and Pounds
                </span>
              </div>
              <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setWeightUnit("kg")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition ${
                    weightUnit === "kg" ? "bg-[#b8ff32] text-[#070908]" : "text-zinc-400"
                  }`}
                >
                  KG
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit("lbs")}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase transition ${
                    weightUnit === "lbs" ? "bg-[#b8ff32] text-[#070908]" : "text-zinc-400"
                  }`}
                >
                  LBS
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-xs font-bold text-white block">
                  Workout Reminders
                </span>
                <span className="text-[11px] text-zinc-400">
                  Daily nudges to log evening sessions
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifWorkout}
                onChange={(e) => setNotifWorkout(e.target.checked)}
                className="h-4 w-4 rounded accent-[#b8ff32] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  Streak Saver Alerts
                </span>
                <span className="text-[11px] text-zinc-400">
                  Notify before daily streak expires
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifStreak}
                onChange={(e) => setNotifStreak(e.target.checked)}
                className="h-4 w-4 rounded accent-[#b8ff32] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Connected Wearables & Storage */}
        <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 backdrop-blur-xl space-y-5">
          <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
            <Smartphone size={18} className="text-emerald-400" />
            Connected Sensor Ecosystem
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Apple Health & WatchOS
                  </span>
                  <span className="text-[10px] text-zinc-400">Syncs Active Calories & HRV</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSyncAppleHealth(!syncAppleHealth)}
                className={`text-xs font-bold uppercase px-3 py-1 rounded-lg border transition ${
                  syncAppleHealth
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-zinc-500"
                }`}
              >
                {syncAppleHealth ? "Connected" : "Disconnected"}
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    Garmin Connect API
                  </span>
                  <span className="text-[10px] text-zinc-400">Syncs GPS Pace & Cadence</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSyncGarmin(!syncGarmin)}
                className={`text-xs font-bold uppercase px-3 py-1 rounded-lg border transition ${
                  syncGarmin
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-white/5 text-zinc-500"
                }`}
              >
                {syncGarmin ? "Connected" : "Disconnected"}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-rose-400 block">
                  Reset Mock Training Data
                </span>
                <span className="text-[10px] text-zinc-500">
                  Restores original mock workouts & goals
                </span>
              </div>
              <button
                type="button"
                onClick={handleResetData}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
              >
                Reset Cache
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8ff32]">
              Athlete Settings
            </span>
            <h3 className="text-2xl font-black uppercase text-white mt-1">
              Edit Physical Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Primary Goal
                  </label>
                  <input
                    type="text"
                    value={formGoal}
                    onChange={(e) => setFormGoal(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Activity Level
                  </label>
                  <input
                    type="text"
                    value={formActivity}
                    onChange={(e) => setFormActivity(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-3 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-300 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formWeight}
                    onChange={(e) => setFormWeight(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-300 mb-1">
                    Target (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formTargetWeight}
                    onChange={(e) => setFormTargetWeight(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-300 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={formHeight}
                    onChange={(e) => setFormHeight(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-zinc-300 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-white/10">
                <Button type="submit" variant="primary" size="md" className="flex-1">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
