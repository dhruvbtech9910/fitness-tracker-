import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  Flame,
  Target,
  Trophy,
  Dumbbell,
  Heart,
  Timer,
  Zap,
  CheckCircle2,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Footprints,
  Calendar,
  Sparkles,
  Award,
  ChevronRight,
  BarChart3,
  Droplets,
  Scale,
  Shield,
  Clock,
  Check,
  X,
  Sliders,
  ChevronDown,
} from "lucide-react";

import Button from "../components/Button";
import SectionHeading from "../components/SectionHeading";
import StarCard from "../components/StarCard";
import WorkoutCard from "../components/WorkoutCard";
import GoalCard from "../components/GoalCard";
import ChallengeCard from "../components/ChallengeCard";

export default function Home() {
  const navigate = useNavigate();
  // Navigation & Modal state
  const [quickLogModalOpen, setQuickLogModalOpen] = useState(false);
  const [activeStreak, setActiveStreak] = useState(7);
  const [selectedWorkoutModal, setSelectedWorkoutModal] = useState(null);

  // Interactive Lab Tab state
  const [labTab, setLabTab] = useState("logger"); // "logger" | "analytics" | "nutrition" | "challenges"

  // Live Rest Timer state
  const [restTimeLeft, setRestTimeLeft] = useState(75);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (restTimeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, restTimeLeft]);

  // Interactive Workout Logger state
  const [selectedExercise, setSelectedExercise] = useState("Barbell Incline Press");
  const [exerciseSets, setExerciseSets] = useState([
    { id: 1, setNumber: 1, weight: 80, reps: 10, completed: true, rpe: 7.5 },
    { id: 2, setNumber: 2, weight: 85, reps: 8, completed: true, rpe: 8.0 },
    { id: 3, setNumber: 3, weight: 90, reps: 6, completed: true, rpe: 8.5 },
    { id: 4, setNumber: 4, weight: 95, reps: 5, completed: false, rpe: 9.0 },
  ]);

  const toggleSetComplete = (id) => {
    setExerciseSets((prev) =>
      prev.map((set) =>
        set.id === id ? { ...set, completed: !set.completed } : set
      )
    );
  };

  const addNewSet = () => {
    const nextSetNumber = exerciseSets.length + 1;
    const lastSet = exerciseSets[exerciseSets.length - 1];
    setExerciseSets([
      ...exerciseSets,
      {
        id: Date.now(),
        setNumber: nextSetNumber,
        weight: lastSet ? lastSet.weight : 80,
        reps: lastSet ? lastSet.reps : 8,
        completed: false,
        rpe: 8.0,
      },
    ]);
  };

  // Calculations for current active workout
  const totalVolumeLoad = exerciseSets
    .filter((s) => s.completed)
    .reduce((acc, curr) => acc + curr.weight * curr.reps, 0);

  const completedSetsCount = exerciseSets.filter((s) => s.completed).length;
  const highestWeight = Math.max(...exerciseSets.map((s) => s.weight), 0);
  // Estimated 1RM (Brzycki formula approximation)
  const estimated1RM = Math.round(highestWeight * (36 / (37 - 5)));

  // Interactive Nutrition state
  const [waterAmount, setWaterAmount] = useState(2400); // ml
  const waterTarget = 3500;
  const [snackCalories, setSnackCalories] = useState(2150); // kcal
  const calorieBudget = 2800;

  const logWater = (ml) => {
    setWaterAmount((prev) => Math.min(prev + ml, 5000));
  };

  const logCalories = (kcal) => {
    setSnackCalories((prev) => Math.min(prev + kcal, 4500));
  };

  // Interactive Analytics state
  const [analyticsRange, setAnalyticsRange] = useState("7D"); // "7D" | "30D" | "90D"
  const [analyticsMetric, setAnalyticsMetric] = useState("volume"); // "volume" | "kcal" | "strain"
  const [hoveredBarIndex, setHoveredBarIndex] = useState(6);

  const handleNavigateAnalytics = () => {
    setLabTab("analytics");
    const el = document.getElementById("analytics") || document.getElementById("lab");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const chartData = {
    "7D": [
      { day: "Mon", volume: 6400, kcal: 540, strain: 13.2 },
      { day: "Tue", volume: 7800, kcal: 620, strain: 15.4 },
      { day: "Wed", volume: 4200, kcal: 410, strain: 10.8 },
      { day: "Thu", volume: 8900, kcal: 730, strain: 17.1 },
      { day: "Fri", volume: 9200, kcal: 690, strain: 16.5 },
      { day: "Sat", volume: 5100, kcal: 480, strain: 11.9 },
      { day: "Sun (Today)", volume: 8400, kcal: 680, strain: 14.8 },
    ],
    "30D": [
      { day: "W1", volume: 38000, kcal: 3900, strain: 14.2 },
      { day: "W2", volume: 42500, kcal: 4300, strain: 15.8 },
      { day: "W3", volume: 45000, kcal: 4600, strain: 16.3 },
      { day: "W4", volume: 48200, kcal: 4820, strain: 16.9 },
    ],
    "90D": [
      { day: "M1", volume: 162000, kcal: 18200, strain: 14.8 },
      { day: "M2", volume: 184000, kcal: 20100, strain: 15.9 },
      { day: "M3", volume: 204000, kcal: 22400, strain: 17.2 },
    ],
  };

  const activeChart = chartData[analyticsRange];

  // Interactive Challenges state
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: "Century Push-up Blitz",
      reward: "Iron Chest Badge",
      participants: 4120,
      daysLeft: 5,
      progress: 82,
      joined: true,
    },
    {
      id: 2,
      title: "Sub-20 5K Sprint Series",
      reward: "Aero Runner Trophy",
      participants: 2890,
      daysLeft: 12,
      progress: 45,
      joined: true,
    },
    {
      id: 3,
      title: "Zero Missed Days: 21-Day Habit",
      reward: "Consistency Crown",
      participants: 6540,
      daysLeft: 14,
      progress: 33,
      joined: false,
    },
    {
      id: 4,
      title: "Heavy Pull 10,000kg Volume",
      reward: "Deadlift Titan Gold",
      participants: 1980,
      daysLeft: 8,
      progress: 0,
      joined: false,
    },
  ]);

  const handleJoinChallenge = (id) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: true, progress: 10 } : c))
    );
  };

  const handleCheckInChallenge = (id) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, progress: Math.min(c.progress + 15, 100) }
          : c
      )
    );
  };

  // Workout Library filters & data
  const [workoutFilter, setWorkoutFilter] = useState("All");

  const workoutsList = [
    {
      id: "w1",
      title: "Hypertrophy Push Dominance",
      category: "Strength",
      duration: "55 Min",
      calories: "520 kcal",
      difficulty: "Intermediate",
      exercisesCount: 6,
      targetMuscles: ["Chest", "Triceps", "Front Delts"],
      isPopular: true,
      description:
        "High-density hypertrophy sequence prioritizing mechanical tension across incline angles and lockout tricep isolation.",
      exercises: [
        { name: "Incline Barbell Press", sets: "4 Sets × 8-10 Reps" },
        { name: "Weighted Dips", sets: "3 Sets × 10-12 Reps" },
        { name: "Dumbbell Overhead Extension", sets: "3 Sets × 12 Reps" },
        { name: "Cable Upper Pec Flyes", sets: "4 Sets × 15 Reps" },
      ],
    },
    {
      id: "w2",
      title: "Posterior Chain Deadlift Engine",
      category: "Strength",
      duration: "65 Min",
      calories: "640 kcal",
      difficulty: "Advanced",
      exercisesCount: 5,
      targetMuscles: ["Hamstrings", "Lats", "Erectors", "Glutes"],
      isPopular: true,
      description:
        "Heavy progressive overload targeting raw pull power, hip hinge stability, and lat lat-width hypertrophy.",
      exercises: [
        { name: "Conventional Barbell Deadlift", sets: "5 Sets × 5 Reps" },
        { name: "Barbell Pendlay Row", sets: "4 Sets × 8 Reps" },
        { name: "Neutral Grip Pull-ups", sets: "4 Sets × Failure" },
        { name: "Romanian Deadlifts (Dumbbell)", sets: "3 Sets × 10 Reps" },
      ],
    },
    {
      id: "w3",
      title: "Metabolic VO2 Max Sprint Series",
      category: "HIIT",
      duration: "35 Min",
      calories: "490 kcal",
      difficulty: "Elite",
      exercisesCount: 8,
      targetMuscles: ["Full Body", "Quads", "Cardio Engine"],
      isPopular: false,
      description:
        "Zone 5 threshold training designed to ramp up mitochondrial density and maximal oxygen consumption.",
      exercises: [
        { name: "Assault Bike 30s Sprint / 30s Rest", sets: "8 Rounds" },
        { name: "Kettlebell American Swings (28kg)", sets: "4 Sets × 20 Reps" },
        { name: "Box Jump Overs (24\")", sets: "4 Sets × 15 Reps" },
        { name: "Burpee to Target", sets: "3 Sets × 12 Reps" },
      ],
    },
    {
      id: "w4",
      title: "Quad Overload & Squat Matrix",
      category: "Strength",
      duration: "60 Min",
      calories: "580 kcal",
      difficulty: "Advanced",
      exercisesCount: 6,
      targetMuscles: ["Quads", "Adductors", "Calves"],
      isPopular: false,
      description:
        "Deep knee flexion and brutal tempo eccentrics focusing on quad teardrop development and leg drive.",
      exercises: [
        { name: "Barbell Back Squats (3s Eccentric)", sets: "5 Sets × 6 Reps" },
        { name: "Bulgarian Split Squats", sets: "3 Sets × 10 / Leg" },
        { name: "Seated Leg Extensions (Drop Set)", sets: "4 Sets × 12-15 Reps" },
        { name: "Standing Calf Raises", sets: "4 Sets × 20 Reps" },
      ],
    },
    {
      id: "w5",
      title: "Mobility Flow & Joint Decompression",
      category: "Mobility",
      duration: "30 Min",
      calories: "160 kcal",
      difficulty: "Beginner",
      exercisesCount: 7,
      targetMuscles: ["Hips", "Thoracic Spine", "Shoulders"],
      isPopular: false,
      description:
        "Active restoration protocols to enhance synovial fluid circulation, thoracic rotation, and hip capsule openness.",
      exercises: [
        { name: "World's Greatest Stretch", sets: "3 Sets × 5 / Side" },
        { name: "Thoracic Windmills", sets: "3 Sets × 8 / Side" },
        { name: "90/90 Hip Flow", sets: "4 Sets × 60s" },
        { name: "Deep Squat Ankle Mobilization", sets: "3 Sets × 90s" },
      ],
    },
    {
      id: "w6",
      title: "Functional Core & Anti-Rotation",
      category: "Endurance",
      duration: "40 Min",
      calories: "320 kcal",
      difficulty: "Intermediate",
      exercisesCount: 6,
      targetMuscles: ["Obliques", "Transverse Abdominis", "Lower Back"],
      isPopular: false,
      description:
        "Unilateral stabilization exercises preventing lateral trunk deviation and maximizing core transfer into main lifts.",
      exercises: [
        { name: "Pallof Cable Press & Hold", sets: "4 Sets × 12 / Side" },
        { name: "Hanging Strict Leg Raises", sets: "4 Sets × 10-12 Reps" },
        { name: "Farmer's Heavy Carry", sets: "5 Sets × 40 Meters" },
        { name: "Ab Wheel Rollouts", sets: "3 Sets × 10 Reps" },
      ],
    },
  ];

  const filteredWorkouts =
    workoutFilter === "All"
      ? workoutsList
      : workoutsList.filter((w) => w.category === workoutFilter);

  // Goal Calculator state
  const [calcGoal, setCalcGoal] = useState("hypertrophy"); // "hypertrophy" | "fatloss" | "endurance"
  const [calcDays, setCalcDays] = useState(4);
  const [calcWeeks, setCalcWeeks] = useState(12);

  const calculateMilestone = () => {
    const totalSessions = calcDays * calcWeeks;
    const estimatedHours = (totalSessions * 1.1).toFixed(0);
    const volumeEstimate = ((totalSessions * 8200) / 1000).toFixed(1); // Tons

    if (calcGoal === "hypertrophy") {
      const muscleGain = (calcWeeks * 0.22 * (calcDays / 4)).toFixed(1);
      return {
        projection: `+${muscleGain} kg Lean Muscle`,
        volume: `${volumeEstimate} Tons Moved`,
        sessions: `${totalSessions} Sessions`,
        hours: `${estimatedHours} Hours Trained`,
        proteinTarget: "185g - 210g Daily",
        calorieAdvice: "+300 kcal Surplus Target",
      };
    } else if (calcGoal === "fatloss") {
      const fatLoss = (calcWeeks * 0.45 * (calcDays / 4)).toFixed(1);
      return {
        projection: `-${fatLoss} kg Body Fat Reduced`,
        volume: `${volumeEstimate} Tons Moved`,
        sessions: `${totalSessions} Sessions`,
        hours: `${estimatedHours} Hours Trained`,
        proteinTarget: "200g - 220g Daily (Preserve Muscle)",
        calorieAdvice: "-450 kcal Deficit Target",
      };
    } else {
      const vo2Gain = (calcWeeks * 0.35 * (calcDays / 4)).toFixed(1);
      return {
        projection: `+${vo2Gain} ml/kg/min VO2 Max Gain`,
        volume: `${volumeEstimate} Tons Moved`,
        sessions: `${totalSessions} Sessions`,
        hours: `${estimatedHours} Hours Trained`,
        proteinTarget: "165g - 180g Daily",
        calorieAdvice: "Maintenance / Carb-Loaded",
      };
    }
  };

  const calcResult = calculateMilestone();

  // Pricing Plan toggle state
  const [billingCycle, setBillingCycle] = useState("annual"); // "monthly" | "annual"

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "How does FITPULSE calculate my strain and readiness score?",
      a: "Our engine analyzes Heart Rate Variability (HRV), resting pulse, sleep stage duration, and cumulative workout volume load using the TRIMP (Training Impulse) algorithm. You receive an uncheatable 0-21 daily exertion metric so you know exactly when to push and when to recover.",
    },
    {
      q: "Can I connect my Apple Watch, Garmin, or Whoop strap?",
      a: "Yes. FITPULSE integrates directly with Apple HealthKit, Garmin Connect API, Whoop 4.0, Polar Bluetooth straps, and Strava. Workouts and biometrics sync automatically in the background with sub-second latency.",
    },
    {
      q: "Does the workout logger calculate 1-Rep Max and progressive overload?",
      a: "Absolutely. FITPULSE logs every single rep, set, and RPE value. It projects your estimated 1RM, calculates total weekly tonnage, flags plateaus, and warns you if you're approaching overreaching before injuries strike.",
    },
    {
      q: "Can I use FITPULSE offline in gyms with poor connectivity?",
      a: "Yes! The web and mobile apps function with full offline caching. All recorded sets, rest timers, and workout notes persist locally and sync to the cloud automatically the moment your connection restores.",
    },
    {
      q: "Is there a free tier for casual lifters?",
      a: "Yes, our Starter plan is 100% free forever and includes unlimited manual workout logging, basic volume charts, and personal record tracking. Upgrade to Pro whenever you want AI coaching and automated wearable sync.",
    },
  ];

  // Quick Log Submission handler
  const [quickLogExerciseName, setQuickLogExerciseName] = useState("Barbell Bench Press");
  const [quickLogWeight, setQuickLogWeight] = useState(85);
  const [quickLogReps, setQuickLogReps] = useState(8);
  const [quickLogSuccess, setQuickLogSuccess] = useState(false);

  const handleQuickLogSubmit = (e) => {
    e.preventDefault();
    setQuickLogSuccess(true);
    setTimeout(() => {
      setQuickLogSuccess(false);
      setQuickLogModalOpen(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070908] text-white selection:bg-[#b8ff32] selection:text-[#070908]">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="relative z-50 border-b border-white/10 bg-gradient-to-r from-emerald-950/80 via-zinc-950 to-zinc-950 px-4 py-2 text-center text-xs font-semibold text-zinc-300">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#b8ff32] animate-ping" />
          <span className="font-bold text-[#b8ff32]">FITPULSE v3.2 LIVE:</span>
          <span className="hidden sm:inline">
            Intelligent Progressive Overload Engine & Heart Rate Zones now active.
          </span>
          <a
            href="#lab"
            className="inline-flex items-center gap-1 font-bold text-white underline underline-offset-4 hover:text-[#b8ff32] transition"
          >
            Launch Live Lab <ArrowUpRight size={13} />
          </a>
        </div>
      </div>

      <main>
        {/* 3. HERO SECTION */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[#070908] pt-12 pb-20 lg:pt-20 lg:pb-32 bg-grid-pattern">
          {/* Ambient background glows */}
          <div className="pointer-events-none absolute -top-40 left-1/4 h-[550px] w-[550px] rounded-full bg-[#b8ff32]/10 blur-[140px]" />
          <div className="pointer-events-none absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[130px]" />

          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              {/* LEFT HERO TEXT & CONTROLS */}
              <div>
                {/* Release Badge */}
                <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#b8ff32] animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-300">
                    Precision Performance Lab // 2026
                  </span>
                </div>

                {/* Main Hero Headline */}
                <h1 className="mt-8 text-5xl sm:text-7xl lg:text-[5.5rem] font-black uppercase tracking-[-0.05em] leading-[0.92] text-white">
                  Track Every Rep.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8ff32] via-[#e2ff88] to-emerald-400">
                    Master Every
                  </span>
                  <br />
                  Metric.
                </h1>

                {/* Subtitle */}
                <p className="mt-7 max-w-xl text-base sm:text-lg leading-relaxed text-zinc-400 font-medium">
                  The quantified training architecture engineered for serious lifters
                  and athletes. Auto-calculate volume load, log RPE sets in seconds,
                  and monitor your real-time heart strain without friction.
                </p>

                {/* Hero Action Buttons */}
                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    variant="primary"
                    icon={ArrowUpRight}
                    onClick={() => navigate("/register")}
                  >
                    Start Free Tracking
                  </Button>

                  <Button
                    size="lg"
                    variant="secondary"
                    icon={Play}
                    iconPosition="left"
                    onClick={() => setQuickLogModalOpen(true)}
                  >
                    Test Quick Logger
                  </Button>
                </div>

                {/* Live Biometric Sync Status & Trust */}
                <div className="mt-14 border-t border-white/10 pt-7">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">
                    Synced with Athlete Wearables
                  </p>
                  <div className="flex flex-wrap items-center gap-6 text-xs text-zinc-400 font-semibold">
                    <span className="flex items-center gap-2 text-white">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Apple HealthKit
                    </span>
                    <span className="flex items-center gap-2 text-white">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Garmin Connect
                    </span>
                    <span className="flex items-center gap-2 text-white">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Whoop 4.0 Biometrics
                    </span>
                    <span className="flex items-center gap-2 text-white">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Strava Cadence
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT HERO INTERACTIVE ATHLETE HUD CARD */}
              <div className="relative">
                {/* Ambient glow under card */}
                <div className="absolute inset-0 -m-3 rounded-3xl bg-gradient-to-tr from-[#b8ff32]/20 via-emerald-500/10 to-transparent blur-2xl opacity-60" />

                {/* Main Glass Panel HUD */}
                <div className="relative rounded-3xl border border-white/15 bg-zinc-950/90 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                  {/* Top Status Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#b8ff32] opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#b8ff32]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8ff32]">
                          Live Session Active
                        </span>
                        <h3 className="text-sm font-black uppercase tracking-tight text-white">
                          Chest & Triceps Hypertrophy
                        </h3>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-right">
                      <span className="font-mono text-xs font-black text-white">
                        00:46:18
                      </span>
                      <p className="text-[8px] uppercase tracking-wider text-zinc-400 font-bold">
                        Elapsed
                      </p>
                    </div>
                  </div>

                  {/* ECG Heart Rate Line + Real-time BPM */}
                  <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                          <Heart size={16} className="animate-heart-pulse" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                            Heart Rate (Zone 4)
                          </p>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-2xl font-black text-white">148</span>
                            <span className="text-[10px] font-bold text-rose-400 uppercase">
                              BPM Peak
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Strain Score Pill */}
                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                          Day Strain
                        </span>
                        <p className="text-lg font-black text-[#b8ff32]">14.8 / 21</p>
                      </div>
                    </div>

                    {/* SVG ECG Wave Animation */}
                    <div className="mt-3 overflow-hidden rounded-lg bg-black/40 py-2 px-1">
                      <svg
                        className="h-9 w-full text-[#b8ff32]"
                        viewBox="0 0 300 40"
                        fill="none"
                        preserveAspectRatio="none"
                      >
                        <path
                          d="M0,20 L40,20 L50,8 L60,32 L70,12 L80,24 L90,20 L140,20 L150,5 L160,35 L170,10 L180,26 L190,20 L240,20 L250,7 L260,33 L270,14 L280,22 L300,20"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-90 drop-shadow-[0_0_8px_#b8ff32]"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Interactive Exercise Sets Logger HUD */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Dumbbell size={15} className="text-[#b8ff32]" />
                        <span className="text-xs font-black uppercase tracking-wider text-white">
                          Current Exercise: Incline Press
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-400">
                        {completedSetsCount} of {exerciseSets.length} Sets Done
                      </span>
                    </div>

                    {/* Sets List with Interactive Checkbox clicks! */}
                    <div className="space-y-2">
                      {exerciseSets.slice(0, 3).map((set) => (
                        <div
                          key={set.id}
                          onClick={() => toggleSetComplete(set.id)}
                          className={`flex items-center justify-between rounded-xl border p-3 transition-all cursor-pointer ${
                            set.completed
                              ? "border-[#b8ff32]/40 bg-[#b8ff32]/10 text-white"
                              : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black transition-colors ${
                                set.completed
                                  ? "bg-[#b8ff32] text-[#070908]"
                                  : "bg-white/10 text-zinc-300"
                              }`}
                            >
                              {set.completed ? <Check size={14} strokeWidth={3} /> : set.setNumber}
                            </div>
                            <span className="text-xs font-bold text-white">
                              Set {set.setNumber}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <span className="font-mono font-bold text-white">
                              {set.weight} kg × {set.reps} reps
                            </span>
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-bold text-zinc-300">
                              RPE {set.rpe}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rest Countdown Bar & Quick Controls */}
                  <div className="mt-5 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-2.5">
                      <Timer size={16} className="text-[#b8ff32]" />
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                          Rest Interval
                        </p>
                        <p className="font-mono text-sm font-black text-white">
                          00:{restTimeLeft < 10 ? `0${restTimeLeft}` : restTimeLeft}s
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-bold uppercase transition ${
                          isTimerRunning
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                            : "bg-[#b8ff32] text-[#070908] hover:bg-[#c9ff4d]"
                        }`}
                      >
                        {isTimerRunning ? <Pause size={12} /> : <Play size={12} />}
                        {isTimerRunning ? "Pause" : "Start"}
                      </button>

                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setRestTimeLeft(75);
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                        title="Reset 75s"
                      >
                        <RotateCcw size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Metrics Bar */}
                  <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4 text-center">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                        Session Volume
                      </p>
                      <p className="mt-0.5 text-lg font-black text-white">
                        {totalVolumeLoad.toLocaleString()} <span className="text-xs text-zinc-400">kg</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                        Burn Rate
                      </p>
                      <p className="mt-0.5 text-lg font-black text-[#b8ff32]">
                        680 <span className="text-xs text-[#b8ff32]/70">kcal</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                        Est. 1RM
                      </p>
                      <p className="mt-0.5 text-lg font-black text-white">
                        {estimated1RM} <span className="text-xs text-zinc-400">kg</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 HERO METRIC QUICK CARDS ROW */}
            <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StarCard
                icon={Flame}
                title="Active Calories Burned"
                value="3,420"
                unit="kcal"
                change="+14.2%"
                isPositive={true}
                subtext="Weekly Average: 3,100 kcal"
                progress={88}
                accentColor="#f97316"
              />
              <StarCard
                icon={Dumbbell}
                title="Total Tonnage Moved"
                value="48.5"
                unit="Tons"
                change="+8.4%"
                isPositive={true}
                subtext="Progressive overload on track"
                progress={94}
                accentColor="#b8ff32"
              />
              <StarCard
                icon={Heart}
                title="Recovery Score"
                value="92"
                unit="%"
                change="+4%"
                isPositive={true}
                subtext="HRV 78ms • Ready for heavy load"
                progress={92}
                accentColor="#10b981"
              />
              <StarCard
                icon={Trophy}
                title="Active Habit Streak"
                value={activeStreak}
                unit="Days"
                change="Personal Best"
                isPositive={true}
                subtext="Iron lifter tier unlocked"
                progress={100}
                accentColor="#38bdf8"
              />
            </div>
          </div>
        </section>

        {/* 4. THE INTERACTIVE FITNESS LAB (CENTERPIECE FEATURE) */}
        <section id="lab" className="relative border-b border-white/10 bg-[#0a0d0b] py-24 lg:py-32">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <SectionHeading
                badge="LIVE INTERACTIVE SANDBOX"
                title="THE ATHLETE"
                highlight="COMMAND CENTER"
                description="Test-drive our real-time tracking engine right here. Switch tabs to log sets, inspect volume curves, track macro intake, or join endurance challenges."
              />

              {/* Lab Tabs Nav */}
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-zinc-950 p-1.5 backdrop-blur-md">
                {[
                  { id: "logger", label: "Workout Logger", icon: Dumbbell },
                  { id: "analytics", label: "Biometrics & Analytics", icon: BarChart3 },
                  { id: "nutrition", label: "Macros & Hydration", icon: Droplets },
                  { id: "challenges", label: "Group Challenges", icon: Trophy },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = labTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setLabTab(tab.id)}
                      className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#b8ff32] text-[#070908] shadow-[0_0_15px_rgba(184,255,50,0.3)]"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB CONTENT 1: WORKOUT LOGGER */}
            {labTab === "logger" && (
              <div className="mt-12 rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-10 backdrop-blur-xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
                      Session In Progress
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white mt-1">
                      {selectedExercise}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">
                      Targeting Anterior Deltoids, Clavicular Pectoral Head & Triceps
                    </p>
                  </div>

                  {/* Routine Switcher */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase text-zinc-400">
                      Switch Routine:
                    </span>
                    <select
                      value={selectedExercise}
                      onChange={(e) => setSelectedExercise(e.target.value)}
                      className="rounded-xl border border-white/15 bg-zinc-900 px-4 py-2 text-xs font-bold text-white focus:border-[#b8ff32] focus:outline-none cursor-pointer"
                    >
                      <option value="Barbell Incline Press">Barbell Incline Press</option>
                      <option value="Heavy Conventional Deadlift">Heavy Conventional Deadlift</option>
                      <option value="High Bar Back Squat">High Bar Back Squat</option>
                      <option value="Weighted Neutral Pull-ups">Weighted Neutral Pull-ups</option>
                    </select>
                  </div>
                </div>

                {/* Sets Table */}
                <div className="mt-8 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        <th className="pb-3 pl-2">Set</th>
                        <th className="pb-3">Weight (KG)</th>
                        <th className="pb-3">Reps Completed</th>
                        <th className="pb-3">RPE (Effort)</th>
                        <th className="pb-3">Volume (KG)</th>
                        <th className="pb-3 pr-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {exerciseSets.map((set) => (
                        <tr
                          key={set.id}
                          className={`transition-colors ${
                            set.completed ? "bg-[#b8ff32]/5" : "hover:bg-white/5"
                          }`}
                        >
                          <td className="py-4 pl-2 font-black text-white">
                            Set #{set.setNumber}
                          </td>
                          <td className="py-4">
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setExerciseSets((prev) =>
                                  prev.map((s) =>
                                    s.id === set.id ? { ...s, weight: val } : s
                                  )
                                );
                              }}
                              className="w-20 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 font-mono text-xs font-bold text-white focus:border-[#b8ff32] focus:outline-none"
                            />
                          </td>
                          <td className="py-4">
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setExerciseSets((prev) =>
                                  prev.map((s) =>
                                    s.id === set.id ? { ...s, reps: val } : s
                                  )
                                );
                              }}
                              className="w-20 rounded-lg border border-white/10 bg-zinc-900 px-3 py-1.5 font-mono text-xs font-bold text-white focus:border-[#b8ff32] focus:outline-none"
                            />
                          </td>
                          <td className="py-4">
                            <span className="rounded bg-white/10 px-2 py-1 font-mono text-[11px] font-bold text-zinc-300">
                              @{set.rpe}
                            </span>
                          </td>
                          <td className="py-4 font-mono font-bold text-white">
                            {(set.weight * set.reps).toLocaleString()} kg
                          </td>
                          <td className="py-4 pr-2 text-right">
                            <button
                              onClick={() => toggleSetComplete(set.id)}
                              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-bold uppercase text-[10px] tracking-wider transition cursor-pointer ${
                                set.completed
                                  ? "bg-[#b8ff32] text-[#070908] hover:bg-[#c9ff4d]"
                                  : "border border-white/15 bg-white/5 text-zinc-300 hover:border-white/30"
                              }`}
                            >
                              {set.completed ? (
                                <>
                                  <Check size={13} strokeWidth={3} /> Done
                                </>
                              ) : (
                                "Mark Complete"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Controls & Summary */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Plus}
                      iconPosition="left"
                      onClick={addNewSet}
                    >
                      Add Another Set
                    </Button>
                    <span className="text-xs text-zinc-400 font-medium">
                      (Sets recalculate volume load automatically)
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                        Exercise Volume
                      </p>
                      <p className="text-xl font-black text-[#b8ff32]">
                        {totalVolumeLoad.toLocaleString()} kg
                      </p>
                    </div>

                    <div className="text-right border-l border-white/10 pl-6">
                      <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
                        Calculated 1RM
                      </p>
                      <p className="text-xl font-black text-white">
                        {estimated1RM} kg
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: BIOMETRICS & ANALYTICS */}
            {labTab === "analytics" && (
              <div className="mt-12 rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-10 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
                      Progressive Overload Analytics
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white mt-1">
                      {analyticsMetric === "volume" && "Training Volume & Tonnage Load"}
                      {analyticsMetric === "kcal" && "Active Calorie Expenditure"}
                      {analyticsMetric === "strain" && "Cardiovascular Strain Index (0-21)"}
                    </h3>
                  </div>

                  {/* Metric & Range Selector */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded-xl border border-white/10 bg-zinc-900 p-1">
                      {[
                        { id: "volume", label: "Volume (kg)" },
                        { id: "kcal", label: "Calories" },
                        { id: "strain", label: "Strain" },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setAnalyticsMetric(m.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition cursor-pointer ${
                            analyticsMetric === m.id
                              ? "bg-[#b8ff32] text-[#070908]"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center rounded-xl border border-white/10 bg-zinc-900 p-1">
                      {["7D", "30D", "90D"].map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setAnalyticsRange(range);
                            setHoveredBarIndex(chartData[range].length - 1);
                          }}
                          className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition cursor-pointer ${
                            analyticsRange === range
                              ? "bg-white/20 text-white"
                              : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Bar Chart with fixed visible height */}
                <div className="mt-10">
                  <div className="flex items-end justify-between gap-3 sm:gap-6 h-64 border-b border-white/10 pb-4">
                    {activeChart.map((item, idx) => {
                      const currentVal =
                        analyticsMetric === "volume"
                          ? item.volume
                          : analyticsMetric === "kcal"
                          ? item.kcal
                          : item.strain;

                      const maxVal = Math.max(
                        ...activeChart.map((c) =>
                          analyticsMetric === "volume"
                            ? c.volume
                            : analyticsMetric === "kcal"
                            ? c.kcal
                            : c.strain
                        )
                      );
                      const heightPercent = Math.round((currentVal / maxVal) * 100);
                      const isHovered = hoveredBarIndex === idx;

                      return (
                        <div
                          key={item.day}
                          onMouseEnter={() => setHoveredBarIndex(idx)}
                          className="group relative flex h-full flex-1 flex-col items-center justify-end cursor-pointer"
                        >
                          {/* Tooltip on hover */}
                          {isHovered && (
                            <div className="absolute -top-16 z-20 rounded-xl border border-[#b8ff32]/30 bg-zinc-900/95 px-3 py-1.5 text-center shadow-xl backdrop-blur-md">
                              <p className="text-[9px] font-black uppercase text-zinc-400">
                                {item.day}
                              </p>
                              <p className="text-xs font-black text-[#b8ff32]">
                                {analyticsMetric === "volume" && `${item.volume.toLocaleString()} kg`}
                                {analyticsMetric === "kcal" && `${item.kcal} kcal`}
                                {analyticsMetric === "strain" && `${item.strain} Strain`}
                              </p>
                            </div>
                          )}

                          {/* Bar with fixed visible height container */}
                          <div className="relative w-full max-w-[48px] h-44 flex items-end overflow-hidden rounded-t-xl bg-white/10 transition-all duration-300">
                            <div
                              style={{ height: `${Math.max(heightPercent, 12)}%` }}
                              className={`w-full rounded-t-xl transition-all duration-500 ${
                                isHovered
                                  ? "bg-[#b8ff32] shadow-[0_0_20px_rgba(184,255,50,0.6)]"
                                  : "bg-gradient-to-t from-emerald-500/70 to-[#b8ff32]/80 group-hover:bg-[#b8ff32]"
                              }`}
                            />
                          </div>

                          {/* Label */}
                          <span
                            className={`mt-3 text-[10px] font-bold uppercase transition ${
                              isHovered ? "text-[#b8ff32] font-black" : "text-zinc-400"
                            }`}
                          >
                            {item.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Analytics Detail Badges */}
                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Selected Day Strain
                      </span>
                      <p className="mt-1 text-2xl font-black text-white">
                        {activeChart[hoveredBarIndex]?.strain || 14.8} / 21
                      </p>
                      <p className="mt-1 text-xs text-emerald-400 font-bold">
                        Optimal Cardiovascular Stimulus
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Active Calorie Burn
                      </span>
                      <p className="mt-1 text-2xl font-black text-[#b8ff32]">
                        {activeChart[hoveredBarIndex]?.kcal || 680} kcal
                      </p>
                      <p className="mt-1 text-xs text-zinc-400 font-medium">
                        Above target daily threshold (+12%)
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                        Total Volume Lifted
                      </span>
                      <p className="mt-1 text-2xl font-black text-white">
                        {(activeChart[hoveredBarIndex]?.volume || 8400).toLocaleString()}{" "}
                        kg
                      </p>
                      <p className="mt-1 text-xs text-zinc-400 font-medium">
                        Progressive overload verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: NUTRITION & HYDRATION */}
            {labTab === "nutrition" && (
              <div className="mt-12 rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-10 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
                      Daily Fuel & Energy Balance
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white mt-1">
                      Macros, Hydration & Calorie Budget
                    </h3>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                    Target: Muscle Hypertrophy (+300 Surplus)
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                  {/* Calorie & Macro Intake */}
                  <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-black uppercase text-white">
                        Caloric Balance
                      </span>
                      <span className="font-mono text-xs font-bold text-[#b8ff32]">
                        {calorieBudget - snackCalories} kcal Remaining
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-white">
                        {snackCalories.toLocaleString()}
                      </span>
                      <span className="text-sm text-zinc-400 font-bold">
                        / {calorieBudget.toLocaleString()} kcal
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-[#b8ff32] transition-all duration-500"
                        style={{
                          width: `${Math.min((snackCalories / calorieBudget) * 100, 100)}%`,
                        }}
                      />
                    </div>

                    {/* Quick Add Calorie Buttons */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => logCalories(200)}
                      >
                        +200 kcal Protein Shake
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => logCalories(450)}
                      >
                        +450 kcal Post-Workout Meal
                      </Button>
                      <button
                        onClick={() => setSnackCalories(1850)}
                        className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                      >
                        Reset
                      </button>
                    </div>

                    {/* Macro Breakdown */}
                    <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-center">
                      <div className="rounded-xl bg-white/5 p-3">
                        <span className="text-[10px] font-bold text-zinc-400">Protein</span>
                        <p className="text-lg font-black text-white">185g</p>
                        <p className="text-[9px] text-[#b8ff32]">Target 200g (92%)</p>
                      </div>
                      <div className="rounded-xl bg-white/5 p-3">
                        <span className="text-[10px] font-bold text-zinc-400">Carbs</span>
                        <p className="text-lg font-black text-white">240g</p>
                        <p className="text-[9px] text-zinc-400">Target 290g (82%)</p>
                      </div>
                      <div className="rounded-xl bg-white/5 p-3">
                        <span className="text-[10px] font-bold text-zinc-400">Fats</span>
                        <p className="text-lg font-black text-white">65g</p>
                        <p className="text-[9px] text-zinc-400">Target 75g (86%)</p>
                      </div>
                    </div>
                  </div>

                  {/* Hydration Tracker */}
                  <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Droplets size={18} className="text-sky-400" />
                          <span className="text-sm font-black uppercase text-white">
                            Hydration Level
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-sky-400">
                          {Math.round((waterAmount / waterTarget) * 100)}% Reached
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-white">
                          {(waterAmount / 1000).toFixed(2)}
                        </span>
                        <span className="text-sm text-zinc-400 font-bold">
                          / {(waterTarget / 1000).toFixed(1)} Liters
                        </span>
                      </div>

                      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-sky-400 transition-all duration-500 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                          style={{
                            width: `${Math.min((waterAmount / waterTarget) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Interactive Water Logger Buttons */}
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                      <button
                        onClick={() => logWater(250)}
                        className="flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition cursor-pointer"
                      >
                        <Plus size={14} /> +250ml Glass
                      </button>
                      <button
                        onClick={() => logWater(500)}
                        className="flex items-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition cursor-pointer"
                      >
                        <Plus size={14} /> +500ml Shaker Bottle
                      </button>
                      <button
                        onClick={() => setWaterAmount(1000)}
                        className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: GROUP CHALLENGES */}
            {labTab === "challenges" && (
              <div className="mt-12 rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-10 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
                      Community & Milestones
                    </span>
                    <h3 className="text-2xl font-black uppercase text-white mt-1">
                      Active Athletic Challenges
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-zinc-400">
                    Over 15,000+ athletes competing this week
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {challenges.map((c) => (
                    <ChallengeCard
                      key={c.id}
                      title={c.title}
                      reward={c.reward}
                      participants={c.participants.toLocaleString()}
                      daysLeft={c.daysLeft}
                      progress={c.progress}
                      joined={c.joined}
                      onJoin={() => handleJoinChallenge(c.id)}
                      onCheckIn={() => handleCheckInChallenge(c.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 5. SYSTEM CAPABILITIES (BENTO GRID ARCHITECTURE) */}
        <section id="features" className="border-b border-white/10 bg-[#070908] py-24 lg:py-36">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <SectionHeading
              badge="ENGINEERED ADVANTAGE"
              title="THE ARCHITECTURE OF"
              highlight="HUMAN PERFORMANCE"
              description="Built from the ground up for athletes who demand exact feedback, not generic fitness advice."
            />

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
              {/* Bento Card 1: Progressive Overload Algorithm */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-md transition-all duration-300 hover:border-[#b8ff32]/50 hover:-translate-y-1 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b8ff32]/10 text-[#b8ff32] border border-[#b8ff32]/20">
                    <TrendingUp size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Core Algorithm 01
                  </span>
                </div>

                <h3 className="mt-6 text-2xl sm:text-3xl font-black uppercase text-white">
                  Intelligent Progressive Overload Detection
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 font-medium">
                  Never plateau again. FITPULSE tracks sets, repetitions, tempo and RPE.
                  When your volume load flattens for more than 14 days, the system
                  recommends deload cycles or wave periodization adjustments.
                </p>

                {/* Visual Preview Graphic */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
                  <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-3">
                    <span>Upper Body Volume Load Trajectory</span>
                    <span className="text-[#b8ff32]">+18.4% Over 6 Weeks</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#b8ff32] w-[78%]" />
                  </div>
                </div>
              </div>

              {/* Bento Card 2: Biometric Sync Hub */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-md transition-all duration-300 hover:border-[#b8ff32]/50 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    <Zap size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Connectivity 02
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black uppercase text-white">
                  Zero-Latency Biometric Hub
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 font-medium">
                  Background sync with Apple Watch, Garmin, and Whoop straps. Real-time
                  HR telemetry while you lift without touching your phone.
                </p>

                <div className="mt-8 flex flex-col gap-2 font-mono text-xs text-zinc-400">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Sync Protocol</span>
                    <span className="text-white">BLE & HealthKit REST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heart Rate Latency</span>
                    <span className="text-[#b8ff32]">&lt; 150ms</span>
                  </div>
                </div>
              </div>

              {/* Bento Card 3: Recovery Index */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-md transition-all duration-300 hover:border-[#b8ff32]/50 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Heart size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Recovery 03
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black uppercase text-white">
                  HRV & Recovery Readiness
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400 font-medium">
                  Daily readiness scores determined by parasympathetic autonomic balance,
                  sleep architecture, and resting pulse variability.
                </p>

                <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <span className="text-xs font-black text-emerald-400 uppercase">
                    Readiness: 94% Optimal
                  </span>
                  <p className="mt-1 text-[11px] text-zinc-300">
                    High CNS tolerance detected. Clear to attempt PR sets today.
                  </p>
                </div>
              </div>

              {/* Bento Card 4: Rest Interval Timer */}
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/50 p-8 backdrop-blur-md transition-all duration-300 hover:border-[#b8ff32]/50 hover:-translate-y-1 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Timer size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Precision 04
                  </span>
                </div>

                <h3 className="mt-6 text-2xl sm:text-3xl font-black uppercase text-white">
                  Intelligent Rest Periods & ATP-CP Recovery
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 font-medium">
                  Automatically tailors rest recommendations based on movement
                  compound tier: 3-4 minutes for maximal squat/deadlift efforts, 60-90
                  seconds for metabolic density work. Audio & haptic chime on completion.
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 font-mono text-sm font-bold text-[#b8ff32]">
                    Compound: 180s
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 font-mono text-sm font-bold text-white">
                    Isolation: 75s
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 font-mono text-sm font-bold text-white">
                    Drop-set: 15s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. WORKOUT ROUTINE LIBRARY & PREVIEWS */}
        <section id="workouts" className="border-b border-white/10 bg-[#0a0d0b] py-24 lg:py-36">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <SectionHeading
                badge="CURATED PROTOCOLS"
                title="ELITE WORKOUT"
                highlight="DATABASE"
                description="Engineered exercise splits tested across thousands of sessions. Click any routine to inspect movements, tempo targets, and target muscles."
              />

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2">
                {["All", "Strength", "HIIT", "Endurance", "Mobility"].map(
                  (filter) => (
                    <button
                      key={filter}
                      onClick={() => setWorkoutFilter(filter)}
                      className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                        workoutFilter === filter
                          ? "bg-[#b8ff32] text-[#070908] shadow-[0_0_15px_rgba(184,255,50,0.3)]"
                          : "border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Workouts Grid */}
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  title={workout.title}
                  category={workout.category}
                  duration={workout.duration}
                  calories={workout.calories}
                  difficulty={workout.difficulty}
                  exercisesCount={workout.exercisesCount}
                  targetMuscles={workout.targetMuscles}
                  isPopular={workout.isPopular}
                  onStart={() => setSelectedWorkoutModal(workout)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* DEDICATED BIOMETRIC & PERFORMANCE ANALYTICS SECTION */}
        <section id="analytics" className="border-b border-white/10 bg-[#070908] py-24 lg:py-36">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <SectionHeading
                badge="QUANTIFIED PERFORMANCE ENGINE"
                title="ADVANCED BIOMETRIC"
                highlight="ANALYTICS"
                description="Monitor cumulative strain, heart rate distribution, and neuromuscular readiness with sub-second precision. No approximations."
              />

              {/* Metric & Timeframe controls */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex rounded-xl border border-white/10 bg-zinc-950 p-1">
                  {[
                    { id: "volume", label: "Volume (kg)" },
                    { id: "kcal", label: "Calories" },
                    { id: "strain", label: "Strain" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setAnalyticsMetric(m.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition cursor-pointer ${
                        analyticsMetric === m.id
                          ? "bg-[#b8ff32] text-[#070908]"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="flex rounded-xl border border-white/10 bg-zinc-950 p-1">
                  {["7D", "30D", "90D"].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setAnalyticsRange(r);
                        setHoveredBarIndex(chartData[r].length - 1);
                      }}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold uppercase transition cursor-pointer ${
                        analyticsRange === r
                          ? "bg-white/20 text-white"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid with Chart & Heart Rate Zones */}
            <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.6fr]">
              {/* Left: Interactive Multi-metric Chart */}
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#b8ff32]">
                      Telemetry Curve
                    </span>
                    <h4 className="text-xl font-black text-white uppercase mt-0.5">
                      {analyticsMetric === "volume" && "Total Weight Tonnage Lifted"}
                      {analyticsMetric === "kcal" && "Active Metabolic Expenditure"}
                      {analyticsMetric === "strain" && "Cardiovascular Strain Index (0-21)"}
                    </h4>
                  </div>
                  <span className="font-mono text-xs font-bold text-zinc-400">
                    Range: {analyticsRange}
                  </span>
                </div>

                {/* Bars */}
                <div className="flex items-end justify-between gap-3 sm:gap-6 h-64 border-b border-white/10 pb-4 pt-6">
                  {activeChart.map((item, idx) => {
                    const currentVal =
                      analyticsMetric === "volume"
                        ? item.volume
                        : analyticsMetric === "kcal"
                        ? item.kcal
                        : item.strain;

                    const maxVal = Math.max(
                      ...activeChart.map((c) =>
                        analyticsMetric === "volume"
                          ? c.volume
                          : analyticsMetric === "kcal"
                          ? c.kcal
                          : c.strain
                      )
                    );

                    const heightPercent = Math.round((currentVal / maxVal) * 100);
                    const isHovered = hoveredBarIndex === idx;

                    return (
                      <div
                        key={item.day}
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        className="group relative flex h-full flex-1 flex-col items-center justify-end cursor-pointer"
                      >
                        {/* Tooltip */}
                        {isHovered && (
                          <div className="absolute -top-16 z-20 rounded-xl border border-[#b8ff32]/30 bg-zinc-900 px-3 py-1.5 text-center shadow-2xl backdrop-blur-md">
                            <p className="text-[9px] font-black uppercase text-zinc-400">
                              {item.day}
                            </p>
                            <p className="text-xs font-black text-[#b8ff32]">
                              {analyticsMetric === "volume" && `${item.volume.toLocaleString()} kg`}
                              {analyticsMetric === "kcal" && `${item.kcal} kcal`}
                              {analyticsMetric === "strain" && `${item.strain} Strain`}
                            </p>
                          </div>
                        )}

                        {/* Bar track and inner bar */}
                        <div className="relative w-full max-w-[48px] h-44 flex items-end overflow-hidden rounded-t-xl bg-white/5 transition-all duration-300">
                          <div
                            style={{ height: `${Math.max(heightPercent, 12)}%` }}
                            className={`w-full rounded-t-xl transition-all duration-500 ${
                              isHovered
                                ? "bg-[#b8ff32] shadow-[0_0_20px_rgba(184,255,50,0.6)]"
                                : "bg-gradient-to-t from-emerald-500/70 to-[#b8ff32]/80 group-hover:bg-[#b8ff32]"
                            }`}
                          />
                        </div>

                        {/* Label */}
                        <span
                          className={`mt-3 text-[10px] font-bold uppercase transition ${
                            isHovered ? "text-[#b8ff32] font-black" : "text-zinc-400"
                          }`}
                        >
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom stats row */}
                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      Average Strain
                    </span>
                    <p className="text-xl font-black text-white mt-1">14.6 / 21</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      Peak Burn Day
                    </span>
                    <p className="text-xl font-black text-[#b8ff32] mt-1">730 kcal</p>
                  </div>
                  <div className="rounded-2xl bg-white/5 p-3">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      Weekly Tonnage
                    </span>
                    <p className="text-xl font-black text-white mt-1">49.8 Tons</p>
                  </div>
                </div>
              </div>

              {/* Right: Heart Rate Zone Telemetry */}
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#b8ff32]">
                      Biometric Distribution
                    </span>
                    <span className="text-xs font-bold text-zinc-400">Weekly Total: 4.8h</span>
                  </div>

                  <h4 className="text-lg font-black uppercase text-white mb-6">
                    Heart Rate Zones
                  </h4>

                  <div className="space-y-4">
                    {[
                      { zone: "Zone 5", name: "Peak / Anaerobic (>175 BPM)", pct: 8, time: "23m", color: "#f43f5e" },
                      { zone: "Zone 4", name: "Threshold (155-175 BPM)", pct: 24, time: "1h 08m", color: "#f97316" },
                      { zone: "Zone 3", name: "Aerobic Power (135-155 BPM)", pct: 36, time: "1h 44m", color: "#b8ff32" },
                      { zone: "Zone 2", name: "Base Endurance (115-135 BPM)", pct: 22, time: "1h 02m", color: "#10b981" },
                      { zone: "Zone 1", name: "Active Recovery (<115 BPM)", pct: 10, time: "28m", color: "#06b6d4" },
                    ].map((z) => (
                      <div key={z.zone}>
                        <div className="flex items-center justify-between text-xs font-bold mb-1">
                          <span className="text-white flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: z.color }} />
                            {z.zone}: <span className="text-zinc-400 text-[11px] font-normal">{z.name}</span>
                          </span>
                          <span className="font-mono text-zinc-300">{z.time} ({z.pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${z.pct}%`, backgroundColor: z.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vitals Summary Pill */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">HRV</span>
                    <p className="text-base font-black text-white">78 ms</p>
                  </div>
                  <div className="text-center border-x border-white/10 px-4">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Resting HR</span>
                    <p className="text-base font-black text-[#b8ff32]">54 bpm</p>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">VO2 Max</span>
                    <p className="text-base font-black text-white">52.4</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Muscle Group Recovery Heatmap Row */}
            <div className="mt-8 rounded-3xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#b8ff32]">
                    Neuromuscular Recovery Status
                  </span>
                  <h4 className="text-lg font-black uppercase text-white mt-0.5">
                    Target Muscle Group Readiness
                  </h4>
                </div>
                <span className="text-xs text-zinc-400 font-semibold">
                  Updated 2 hours ago from workout logs
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  { muscle: "Chest (Pecs)", recovery: 95, status: "Ready for Heavy Load", color: "#b8ff32" },
                  { muscle: "Back (Lats & Traps)", recovery: 88, status: "Ready for Training", color: "#b8ff32" },
                  { muscle: "Quads & Glutes", recovery: 42, status: "Fatigued (Need 24h)", color: "#f97316" },
                  { muscle: "Shoulders (Delts)", recovery: 82, status: "Fully Rested", color: "#b8ff32" },
                  { muscle: "Core & Abdominals", recovery: 100, status: "Primed for Action", color: "#10b981" },
                ].map((m) => (
                  <div key={m.muscle} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black text-white">{m.muscle}</span>
                      <span className="font-mono text-xs font-black" style={{ color: m.color }}>
                        {m.recovery}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden mb-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${m.recovery}%`, backgroundColor: m.color }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-400 font-semibold block">{m.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. INTERACTIVE GOAL & OVERLOAD CALCULATOR */}
        <section id="calculator" className="border-b border-white/10 bg-[#070908] py-24 lg:py-36">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-16 lg:grid-cols-2 items-center">
              <div>
                <SectionHeading
                  badge="MATHEMATICAL PROJECTION"
                  title="PREDICT YOUR"
                  highlight="PHYSICAL MILESTONES"
                  description="Adjust your target training frequency and timeframe to calculate projected hypertrophy, total tonnage moved, and recommended macro targets."
                />

                {/* Goal Selector */}
                <div className="mt-10">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Step 1: Select Primary Directive
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "hypertrophy", label: "Hypertrophy (Muscle)" },
                      { id: "fatloss", label: "Fat Loss (Cut)" },
                      { id: "endurance", label: "Athletic Conditioning" },
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setCalcGoal(g.id)}
                        className={`rounded-xl border p-3 text-xs font-bold uppercase tracking-wider transition cursor-pointer text-center ${
                          calcGoal === g.id
                            ? "border-[#b8ff32] bg-[#b8ff32]/10 text-[#b8ff32]"
                            : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/20"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frequency Slider */}
                <div className="mt-8">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-zinc-400 uppercase tracking-wider">
                      Training Frequency:
                    </span>
                    <span className="text-[#b8ff32] font-mono font-black">
                      {calcDays} Days / Week
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={calcDays}
                    onChange={(e) => setCalcDays(Number(e.target.value))}
                    className="w-full accent-[#b8ff32] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                    <span>2 Days (Recovery Focus)</span>
                    <span>4 Days (Standard Split)</span>
                    <span>6 Days (Athlete PPL)</span>
                  </div>
                </div>

                {/* Duration Slider */}
                <div className="mt-8">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-zinc-400 uppercase tracking-wider">
                      Commitment Window:
                    </span>
                    <span className="text-[#b8ff32] font-mono font-black">
                      {calcWeeks} Weeks
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="4"
                    value={calcWeeks}
                    onChange={(e) => setCalcWeeks(Number(e.target.value))}
                    className="w-full accent-[#b8ff32] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                    <span>4 Weeks</span>
                    <span>12 Weeks (1 Macrocycle)</span>
                    <span>24 Weeks (Half Year)</span>
                  </div>
                </div>
              </div>

              {/* CALCULATOR OUTPUT CARD */}
              <div className="rounded-3xl border border-[#b8ff32]/30 bg-zinc-950 p-8 sm:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(184,255,50,0.1)]">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
                  Algorithmic Forecast
                </span>
                <h3 className="mt-2 text-3xl sm:text-4xl font-black uppercase text-white">
                  {calcResult.projection}
                </h3>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      Total Weight Moved
                    </span>
                    <p className="mt-1 text-2xl font-black text-white">
                      {calcResult.volume}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      Completed Sessions
                    </span>
                    <p className="mt-1 text-2xl font-black text-[#b8ff32]">
                      {calcResult.sessions}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      Hours on the Floor
                    </span>
                    <p className="mt-1 text-2xl font-black text-white">
                      {calcResult.hours}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <span className="text-[10px] font-bold uppercase text-zinc-400">
                      Macro Strategy
                    </span>
                    <p className="mt-1 text-xs font-black text-[#b8ff32]">
                      {calcResult.calorieAdvice}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {calcResult.proteinTarget}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    Ready to lock in this trajectory?
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      const el = document.getElementById("pricing");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Lock Plan In App
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. ATHLETE TESTIMONIALS & PROOF */}
        <section className="border-b border-white/10 bg-[#0a0d0b] py-24 lg:py-32">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
            <SectionHeading
              badge="VERIFIED LIFTERS"
              title="MEASURABLE"
              highlight="TRANSFORMATIONS"
              description="Real athletes who replaced guesswork with biometrics and systematic progressive overload."
            />

            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  name: "Marcus Vance",
                  role: "Competitive Powerlifter",
                  stat: "+32.5 kg Squat PR",
                  period: "14 Weeks on FITPULSE",
                  quote:
                    "The volume tonnage graphs stopped me from grinding into tendinitis. Being able to see my fatigue spikes before getting hurt allowed me to hit a 240kg squat effortlessly.",
                },
                {
                  name: "Elena Rostova",
                  role: "CrossFit Competitor",
                  stat: "+4.8 ml/kg VO2 Max",
                  period: "8 Weeks on FITPULSE",
                  quote:
                    "Connecting my heart rate chest strap and having the rest interval beep straight into my earbuds completely elevated my MetCon pacing.",
                },
                {
                  name: "David Chen",
                  role: "Natural Bodybuilder",
                  stat: "-5.2% Body Fat Kept",
                  period: "12-Week Prep",
                  quote:
                    "The hydration and macro integration is cleaner than any clunky nutrition app I've used. Having my sets and my protein in one dark-mode screen is unmatched.",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8 backdrop-blur-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#b8ff32]/10 border border-[#b8ff32]/30 px-3 py-1 text-xs font-black text-[#b8ff32]">
                        {t.stat}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">
                        {t.period}
                      </span>
                    </div>

                    <p className="mt-6 text-sm leading-relaxed text-zinc-300 italic">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="mt-8 border-t border-white/5 pt-4">
                    <p className="text-base font-black text-white">{t.name}</p>
                    <p className="text-xs text-zinc-400 font-medium">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. PRICING & MEMBERSHIP PLANS */}
        <section id="pricing" className="border-b border-white/10 bg-[#070908] py-24 lg:py-36">
          <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12 text-center">
            <SectionHeading
              badge="MEMBERSHIP TIERS"
              title="INVEST IN YOUR"
              highlight="PHYSICAL CEILING"
              description="Choose the tier tailored to your training ambitions. Cancel or adjust anytime."
              align="center"
            />

            {/* Monthly / Annual Toggle */}
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950 p-1.5 backdrop-blur-md">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-5 py-2 text-xs font-bold uppercase transition cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-[#b8ff32] text-[#070908]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase transition cursor-pointer ${
                  billingCycle === "annual"
                    ? "bg-[#b8ff32] text-[#070908]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Annual <span className="rounded bg-black/20 px-1.5 py-0.2 text-[9px] font-black">Save 30%</span>
              </button>
            </div>

            {/* Pricing Cards */}
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 text-left">
              {/* Plan 1: Free Starter */}
              <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Starter
                  </span>
                  <h4 className="mt-2 text-2xl font-black text-white">Free Forever</h4>
                  <p className="mt-2 text-xs text-zinc-400">
                    Essential logging for casual athletes & beginners.
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">$0</span>
                    <span className="text-xs text-zinc-400">/ month</span>
                  </div>

                  <ul className="mt-8 space-y-3 text-xs text-zinc-300">
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Unlimited workout logging
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Basic volume load & 1RM calculator
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Rest interval timer
                    </li>
                    <li className="flex items-center gap-2.5 text-zinc-600">
                      <X size={15} /> Wearable HR & sleep sync
                    </li>
                    <li className="flex items-center gap-2.5 text-zinc-600">
                      <X size={15} /> AI periodization engine
                    </li>
                  </ul>
                </div>

                <Button variant="secondary" className="mt-10 w-full" onClick={() => setQuickLogModalOpen(true)}>
                  Get Started Free
                </Button>
              </div>

              {/* Plan 2: Pro Athlete (Featured) */}
              <div className="relative rounded-3xl border-2 border-[#b8ff32] bg-zinc-950 p-8 shadow-[0_0_50px_rgba(184,255,50,0.2)] flex flex-col justify-between">
                <div className="absolute -top-3.5 right-8 rounded-full bg-[#b8ff32] px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#070908]">
                  Most Popular
                </div>

                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
                    Pro Athlete
                  </span>
                  <h4 className="mt-2 text-2xl font-black text-white">
                    Peak Performance
                  </h4>
                  <p className="mt-2 text-xs text-zinc-400">
                    Full biometric synchronization, HRV analysis, and fatigue alerts.
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">
                      {billingCycle === "annual" ? "$14" : "$19"}
                    </span>
                    <span className="text-xs text-zinc-400">/ month</span>
                  </div>

                  <ul className="mt-8 space-y-3 text-xs text-zinc-200">
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      All Starter capabilities included
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Live wearable sync (Apple, Garmin, Whoop)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Real-time Heart Rate Zone telemetry
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Progressive Overload plateau warning AI
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Advanced Macro & Hydration tracking
                    </li>
                  </ul>
                </div>

                <Button variant="primary" className="mt-10 w-full" onClick={() => setQuickLogModalOpen(true)}>
                  Start 14-Day Free Trial
                </Button>
              </div>

              {/* Plan 3: Elite Coaching */}
              <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8 backdrop-blur-md flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
                    Coach & Lab
                  </span>
                  <h4 className="mt-2 text-2xl font-black text-white">
                    Elite Coaching
                  </h4>
                  <p className="mt-2 text-xs text-zinc-400">
                    For powerlifting coaches, trainers, and elite combat athletes.
                  </p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">
                      {billingCycle === "annual" ? "$39" : "$49"}
                    </span>
                    <span className="text-xs text-zinc-400">/ month</span>
                  </div>

                  <ul className="mt-8 space-y-3 text-xs text-zinc-300">
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Everything in Pro Athlete
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Up to 25 Athlete client rosters
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Custom team leaderboards & challenges
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      CSV & raw JSON metric export
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check size={15} className="text-[#b8ff32]" />
                      Dedicated sports scientist support
                    </li>
                  </ul>
                </div>

                <Button variant="secondary" className="mt-10 w-full">
                  Contact Team Lab
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FREQUENTLY ASKED QUESTIONS */}
        <section className="border-b border-white/10 bg-[#0a0d0b] py-24 lg:py-32">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <SectionHeading
              badge="KNOWLEDGE BASE"
              title="FREQUENTLY ASKED"
              highlight="QUESTIONS"
              align="center"
            />

            <div className="mt-14 space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.q}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60 transition"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      className="flex w-full items-center justify-between p-6 text-left cursor-pointer"
                    >
                      <span className="text-base font-black text-white">
                        {faq.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-[#b8ff32] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-sm leading-relaxed text-zinc-400 border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 11. HIGH IMPACT CALL TO ACTION */}
        <section className="relative overflow-hidden bg-[#b8ff32] text-[#070908] px-6 py-24 lg:px-12 lg:py-32 select-none">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-dots-pattern opacity-20 pointer-events-none" />

          <div className="relative mx-auto max-w-[1500px]">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/60">
                  Ready when you are
                </span>
                <h2 className="mt-4 text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-[-0.04em] leading-[0.92]">
                  STOP GUESSING.
                  <br />
                  QUANTIFY YOUR
                  <br />
                  PROGRESSION.
                </h2>
                <p className="mt-6 max-w-xl text-base sm:text-lg font-bold text-black/75">
                  Join 140,000+ athletes who build stronger, leaner, and more resilient
                  bodies with data precision. 14-day free trial on Pro.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-end">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full sm:w-auto rounded-2xl bg-[#070908] px-8 py-5 text-sm font-black uppercase tracking-wider text-white shadow-2xl transition hover:bg-[#161c18] hover:scale-105 cursor-pointer"
                >
                  Launch Athlete Account
                </button>

                <a
                  href="#lab"
                  className="w-full sm:w-auto rounded-2xl border-2 border-[#070908] px-8 py-5 text-sm font-black uppercase tracking-wider text-[#070908] text-center transition hover:bg-black hover:text-white"
                >
                  Re-visit Live Lab
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 13. QUICK WORKOUT LOGGER POPUP MODAL */}
      {quickLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setQuickLogModalOpen(false)}
              className="absolute right-5 top-5 rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#b8ff32] text-[#070908]">
                <Dumbbell size={20} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#b8ff32]">
                  Instant Logging
                </span>
                <h3 className="text-xl font-black uppercase text-white">
                  Record Set In 3 Seconds
                </h3>
              </div>
            </div>

            {quickLogSuccess ? (
              <div className="my-10 text-center animate-in zoom-in-95">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#b8ff32] text-[#070908]">
                  <Check size={32} strokeWidth={3} />
                </div>
                <h4 className="mt-4 text-xl font-black text-white uppercase">
                  Set Recorded Successfully!
                </h4>
                <p className="mt-1 text-xs text-zinc-400">
                  Added to today's volume load ({quickLogWeight * quickLogReps} kg)
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickLogSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-zinc-400 block mb-1">
                    Movement Name
                  </label>
                  <input
                    type="text"
                    value={quickLogExerciseName}
                    onChange={(e) => setQuickLogExerciseName(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-400 block mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={quickLogWeight}
                      onChange={(e) => setQuickLogWeight(Number(e.target.value))}
                      required
                      min="1"
                      className="w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white focus:border-[#b8ff32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase text-zinc-400 block mb-1">
                      Reps
                    </label>
                    <input
                      type="number"
                      value={quickLogReps}
                      onChange={(e) => setQuickLogReps(Number(e.target.value))}
                      required
                      min="1"
                      className="w-full rounded-xl border border-white/15 bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white focus:border-[#b8ff32] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 flex justify-between text-xs">
                  <span className="text-zinc-400">Calculated Set Volume:</span>
                  <span className="font-mono font-bold text-[#b8ff32]">
                    {(quickLogWeight * quickLogReps).toLocaleString()} kg
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    size="lg"
                  >
                    Confirm & Log Set
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 14. WORKOUT DETAIL MODAL */}
      {selectedWorkoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-zinc-950 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedWorkoutModal(null)}
              className="absolute right-5 top-5 rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <span className="rounded bg-[#b8ff32]/20 border border-[#b8ff32]/30 px-2.5 py-0.5 text-[10px] font-black uppercase text-[#b8ff32]">
              {selectedWorkoutModal.category} • {selectedWorkoutModal.difficulty}
            </span>

            <h3 className="mt-3 text-2xl font-black uppercase text-white">
              {selectedWorkoutModal.title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-zinc-400">
              {selectedWorkoutModal.description}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/10 py-3 text-center text-xs">
              <div>
                <span className="text-zinc-500 font-bold block">DURATION</span>
                <span className="font-black text-white">{selectedWorkoutModal.duration}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">EST. BURN</span>
                <span className="font-black text-[#b8ff32]">{selectedWorkoutModal.calories}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">EXERCISES</span>
                <span className="font-black text-white">{selectedWorkoutModal.exercisesCount} Moves</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 mb-3">
                Movement Sequence & Sets
              </h4>
              <div className="space-y-2">
                {selectedWorkoutModal.exercises?.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs"
                  >
                    <span className="font-bold text-white">{ex.name}</span>
                    <span className="font-mono text-[#b8ff32] font-semibold">{ex.sets}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  setSelectedExercise(selectedWorkoutModal.exercises?.[0]?.name || "Incline Press");
                  setSelectedWorkoutModal(null);
                  const el = document.getElementById("lab");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Load Into Active Lab
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedWorkoutModal(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
