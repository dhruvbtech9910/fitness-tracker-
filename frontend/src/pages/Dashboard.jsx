import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Flame,
  Clock,
  Dumbbell,
  Zap,
  TrendingUp,
  Plus,
  Target,
  Trophy,
  ArrowUpRight,
  Calendar,
  Sparkles,
  ChevronRight,
  Activity,
  Award,
  CheckCircle2,
  X,
} from "lucide-react";
import StatCard from "../components/StatCard";
import WorkoutCard from "../components/WorkoutCard";
import GoalCard from "../components/GoalCard";
import ChallengeCard from "../components/ChallengeCard";
import Button from "../components/Button";
import authService from "../services/authService";
import workoutService from "../services/workoutService";
import goalService from "../services/goalService";
import challengeService from "../services/challengeService";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const [workouts, setWorkouts] = useState([]);
  const [goals, setGoals] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Log Workout Modal State
  const [quickLogOpen, setQuickLogOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickCategory, setQuickCategory] = useState("Strength");
  const [quickDuration, setQuickDuration] = useState("45");
  const [quickCalories, setQuickCalories] = useState("450");
  const [quickLogSuccess, setQuickLogSuccess] = useState(false);

  // Selected workout modal for viewing details
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Weekly activity chart hover state
  const [hoveredDay, setHoveredDay] = useState(6);

  useEffect(() => {
    async function loadData() {
      try {
        const [wData, gData, cData] = await Promise.all([
          workoutService.getWorkouts(),
          goalService.getGoals(),
          challengeService.getChallenges(),
        ]);
        setWorkouts(wData);
        setGoals(gData);
        setChallenges(cData);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickLogSubmit = async (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const newWorkout = await workoutService.createWorkout({
      title: quickTitle,
      category: quickCategory,
      durationMinutes: parseInt(quickDuration, 10) || 45,
      caloriesBurned: parseInt(quickCalories, 10) || 450,
      difficulty: "Intermediate",
      targetMuscles: ["Full Body"],
      exercises: [
        { name: "Primary Exercise", sets: 4, reps: 10, weight: 60, completed: true },
      ],
    });

    setWorkouts((prev) => [newWorkout, ...prev]);
    setQuickLogSuccess(true);
    setTimeout(() => {
      setQuickLogSuccess(false);
      setQuickLogOpen(false);
      setQuickTitle("");
    }, 1000);
  };

  const handleJoinChallenge = async (id) => {
    const updated = await challengeService.joinChallenge(id);
    if (updated) {
      setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
  };

  const handleCheckInChallenge = async (id) => {
    const updated = await challengeService.checkInChallenge(id);
    if (updated) {
      setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
    }
  };

  // Weekly chart mock telemetry
  const weeklyActivity = [
    { day: "Mon", calories: 520, minutes: 48, volume: 6400, label: "Mon" },
    { day: "Tue", calories: 640, minutes: 65, volume: 7800, label: "Tue" },
    { day: "Wed", calories: 410, minutes: 35, volume: 4200, label: "Wed" },
    { day: "Thu", calories: 730, minutes: 70, volume: 8900, label: "Thu" },
    { day: "Fri", calories: 690, minutes: 60, volume: 9200, label: "Fri" },
    { day: "Sat", calories: 480, minutes: 45, volume: 5100, label: "Sat" },
    { day: "Sun", calories: 680, minutes: 55, volume: 8400, label: "Today" },
  ];

  const maxCal = Math.max(...weeklyActivity.map((d) => d.calories));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. WELCOME BANNER & DATE */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c130e] via-[#090d0b] to-[#070908] p-6 sm:p-8 backdrop-blur-xl">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#b8ff32]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-[#b8ff32] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
                Athlete Active // System Online
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Welcome back, {user?.name || "Alex Vance"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-medium">
              You're currently on a{" "}
              <span className="text-[#b8ff32] font-black">
                {user?.activeStreak || 14}-day training streak
              </span>
              . Target volume is up 8% this week. Keep pressing!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              iconPosition="left"
              onClick={() => setQuickLogOpen(true)}
            >
              Quick Log Workout
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={TrendingUp}
              onClick={() => navigate("/progress")}
            >
              View Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* 2. STATS ROW (TODAY'S ACTIVITY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Flame}
          title="Calories Burned"
          value="680"
          unit="kcal"
          change="+14%"
          isPositive={true}
          subtext="Target: 800 kcal"
          progress={85}
          accentColor="#b8ff32"
        />

        <StatCard
          icon={Clock}
          title="Active Minutes"
          value="55"
          unit="min"
          change="+8%"
          isPositive={true}
          subtext="Target: 60 min"
          progress={92}
          accentColor="#10b981"
        />

        <StatCard
          icon={Zap}
          title="Training Streak"
          value={user?.activeStreak || 14}
          unit="days"
          change="All-time PR"
          isPositive={true}
          subtext="Consistency: 100%"
          progress={100}
          accentColor="#f59e0b"
        />

        <StatCard
          icon={Dumbbell}
          title="Weekly Tonnage"
          value="46.2"
          unit="tons"
          change="+12%"
          isPositive={true}
          subtext="4 Sessions logged"
          progress={77}
          accentColor="#38bdf8"
        />
      </div>

      {/* 3. WEEKLY ACTIVITY VISUALIZATION & STRAIN CHART */}
      <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#b8ff32]" />
              <h2 className="text-lg font-black uppercase tracking-tight text-white">
                Weekly Activity & Caloric Exertion
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Daily burn distribution across the current microcycle
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-md bg-[#b8ff32]" />
              <span className="text-zinc-300">Calories (kcal)</span>
            </div>
            <Link
              to="/progress"
              className="text-xs font-bold text-[#b8ff32] hover:underline flex items-center gap-1"
            >
              <span>Full Breakdown</span>
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* CSS/SVG Bar Chart */}
        <div className="mt-8">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-6 pb-2">
            {weeklyActivity.map((d, index) => {
              const heightPct = Math.round((d.calories / maxCal) * 100);
              const isHovered = hoveredDay === index;
              return (
                <div
                  key={d.day}
                  onMouseEnter={() => setHoveredDay(index)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div
                    className={`transition-all duration-200 mb-2 rounded-xl bg-zinc-900 border border-white/20 px-2.5 py-1 text-center shadow-xl ${
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    }`}
                  >
                    <span className="font-mono text-xs font-black text-[#b8ff32] block">
                      {d.calories} kcal
                    </span>
                    <span className="text-[9px] text-zinc-400 font-medium">
                      {d.minutes} min • {(d.volume / 1000).toFixed(1)}t
                    </span>
                  </div>

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[48px] bg-white/5 rounded-xl h-full flex items-end p-1 overflow-hidden">
                    <div
                      className={`w-full rounded-lg transition-all duration-500 ${
                        index === 6
                          ? "bg-gradient-to-t from-emerald-400 to-[#b8ff32] shadow-[0_0_15px_rgba(184,255,50,0.4)]"
                          : "bg-white/20 group-hover:bg-[#b8ff32]/70"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span
                    className={`mt-3 text-[11px] font-bold uppercase tracking-wider ${
                      index === 6 ? "text-[#b8ff32] font-black" : "text-zinc-400"
                    }`}
                  >
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. TWO-COLUMN SECTION: RECENT WORKOUTS & ACTIVE GOALS */}
      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        {/* Left: Recent Workouts */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Dumbbell size={18} className="text-[#b8ff32]" />
                Recent Workouts
              </h2>
              <p className="text-xs text-zinc-400">Latest completed training sessions</p>
            </div>
            <Link
              to="/workouts"
              className="text-xs font-bold text-[#b8ff32] hover:underline flex items-center gap-1"
            >
              <span>View All ({workouts.length})</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="space-y-4">
            {workouts.slice(0, 3).map((w) => (
              <WorkoutCard
                key={w.id}
                title={w.title}
                category={w.category}
                duration={w.duration}
                calories={w.calories}
                difficulty={w.difficulty}
                exercisesCount={w.exercisesCount}
                targetMuscles={w.targetMuscles}
                isPopular={w.isPopular}
                date={w.date}
                description={w.description}
                onStart={() => setSelectedWorkout(w)}
              />
            ))}
          </div>
        </div>

        {/* Right: Goals & Active Challenges */}
        <div className="space-y-8">
          {/* Active Goals */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Target size={18} className="text-[#b8ff32]" />
                  Active Targets
                </h2>
                <p className="text-xs text-zinc-400">Progress toward personal milestones</p>
              </div>
              <Link
                to="/goals"
                className="text-xs font-bold text-[#b8ff32] hover:underline flex items-center gap-1"
              >
                <span>Manage</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="space-y-4">
              {goals.slice(0, 2).map((g) => (
                <GoalCard
                  key={g.id}
                  title={g.title}
                  category={g.category}
                  current={g.current}
                  target={g.target}
                  unit={g.unit}
                  deadline={g.deadline}
                  progress={g.progress}
                  status={g.status}
                  notes={g.notes}
                  onUpdate={() => navigate("/goals")}
                />
              ))}
            </div>
          </div>

          {/* Active Challenge widget */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Trophy size={18} className="text-amber-400" />
                  Community Challenge
                </h2>
                <p className="text-xs text-zinc-400">Compete with fellow athletes</p>
              </div>
              <Link
                to="/challenges"
                className="text-xs font-bold text-[#b8ff32] hover:underline flex items-center gap-1"
              >
                <span>All Challenges</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>

            {challenges[0] && (
              <ChallengeCard
                title={challenges[0].title}
                category={challenges[0].category}
                reward={challenges[0].reward}
                description={challenges[0].description}
                participants={challenges[0].participants}
                daysLeft={challenges[0].daysLeft}
                progress={challenges[0].progress}
                joined={challenges[0].joined}
                completed={challenges[0].completed}
                onJoin={() => handleJoinChallenge(challenges[0].id)}
                onCheckIn={() => handleCheckInChallenge(challenges[0].id)}
              />
            )}
          </div>
        </div>
      </div>

      {/* QUICK LOG WORKOUT MODAL */}
      {quickLogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setQuickLogOpen(false)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8ff32]">
                Instant Telemetry
              </span>
              <h3 className="text-2xl font-black uppercase text-white mt-1">
                Log New Workout Session
              </h3>
              <p className="text-xs text-zinc-400">
                Record your exertion metrics directly to your training ledger.
              </p>
            </div>

            {quickLogSuccess ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-2" />
                <h4 className="text-base font-black text-white uppercase">Workout Logged!</h4>
                <p className="text-xs text-zinc-400 mt-1">Your stats have been updated.</p>
              </div>
            ) : (
              <form onSubmit={handleQuickLogSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Session Title
                  </label>
                  <input
                    type="text"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    placeholder="e.g. Upper Body Power Hypertrophy"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                      Category
                    </label>
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0e120f] py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                    >
                      <option value="Strength">Strength</option>
                      <option value="HIIT">HIIT</option>
                      <option value="Cardio">Cardio</option>
                      <option value="Mobility">Mobility</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={quickDuration}
                      onChange={(e) => setQuickDuration(e.target.value)}
                      placeholder="45"
                      min="5"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                      Calories (kcal)
                    </label>
                    <input
                      type="number"
                      value={quickCalories}
                      onChange={(e) => setQuickCalories(e.target.value)}
                      placeholder="450"
                      min="10"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="submit" variant="primary" size="md" className="flex-1">
                    Save Workout
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    onClick={() => setQuickLogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* VIEW WORKOUT DETAILS MODAL */}
      {selectedWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedWorkout(null)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8ff32]">
              {selectedWorkout.category} // {selectedWorkout.difficulty}
            </span>
            <h3 className="text-2xl font-black uppercase text-white mt-1">
              {selectedWorkout.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              {selectedWorkout.description || "Comprehensive high-performance workout sequence."}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-white/10 py-3 text-center text-xs">
              <div>
                <span className="text-zinc-500 font-bold block">DURATION</span>
                <span className="font-black text-white">{selectedWorkout.duration}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">CALORIES</span>
                <span className="font-black text-[#b8ff32]">{selectedWorkout.calories}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">EXERCISES</span>
                <span className="font-black text-white">
                  {selectedWorkout.exercises?.length || selectedWorkout.exercisesCount} Moves
                </span>
              </div>
            </div>

            {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
              <div className="mt-6">
                <h4 className="text-xs font-black uppercase text-zinc-300 mb-3">
                  Exercise Breakdown
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedWorkout.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs"
                    >
                      <span className="font-bold text-white">{ex.name}</span>
                      <span className="font-mono text-[#b8ff32] font-semibold">
                        {ex.sets} Sets × {ex.reps || 10} Reps {ex.weight ? `@ ${ex.weight}kg` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedWorkout(null)}
              >
                Close Routine
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
