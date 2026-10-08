import React, { useState } from "react";
import {
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Clock,
  Dumbbell,
  Scale,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  Trophy,
  Activity,
  ArrowUpRight,
  Shield,
} from "lucide-react";
import Button from "../components/Button";
import { MOCK_PR_RECORDS } from "../utils/constants";
import { formatNumber } from "../utils/helpers";

export default function Progress() {
  const [timeframe, setTimeframe] = useState("30D"); // "7D" | "30D" | "90D"
  const [prs, setPrs] = useState(MOCK_PR_RECORDS);
  const [prModalOpen, setPrModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newReps, setNewReps] = useState("1");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleAddPR = (e) => {
    e.preventDefault();
    if (!newExercise.trim() || !newWeight.trim()) return;

    const newPrItem = {
      id: `pr_${Date.now()}`,
      exercise: newExercise,
      weight: newWeight,
      reps: parseInt(newReps, 10) || 1,
      date: "Today",
      badge: "Gold",
    };

    setPrs([newPrItem, ...prs]);
    setPrModalOpen(false);
    setNewExercise("");
    setNewWeight("");
    showToast("Personal Record added to Trophy Case!");
  };

  // Mock progression series based on timeframe
  const volumeData = {
    "7D": [
      { label: "Mon", val: 6400, kcal: 520 },
      { label: "Tue", val: 7800, kcal: 640 },
      { label: "Wed", val: 4200, kcal: 410 },
      { label: "Thu", val: 8900, kcal: 730 },
      { label: "Fri", val: 9200, kcal: 690 },
      { label: "Sat", val: 5100, kcal: 480 },
      { label: "Sun", val: 8400, kcal: 680 },
    ],
    "30D": [
      { label: "Week 1", val: 38200, kcal: 3900 },
      { label: "Week 2", val: 42500, kcal: 4300 },
      { label: "Week 3", val: 45800, kcal: 4600 },
      { label: "Week 4", val: 50400, kcal: 5100 },
    ],
    "90D": [
      { label: "Month 1", val: 162000, kcal: 18200 },
      { label: "Month 2", val: 184000, kcal: 20100 },
      { label: "Month 3", val: 208000, kcal: 22800 },
    ],
  }[timeframe];

  const maxVal = Math.max(...volumeData.map((d) => d.val));

  // 35-day consistency heatmap
  const heatmapDays = Array.from({ length: 35 }, (_, i) => {
    // Generate realistic distribution of rest vs light vs hard training days
    const isRest = [2, 7, 13, 19, 24, 30].includes(i);
    const intensity = isRest ? 0 : (i % 3) + 1; // 0, 1, 2, 3
    return { day: i + 1, intensity };
  });

  // Milestones timeline
  const milestones = [
    {
      title: "Hit 190kg Deadlift PR",
      date: "3 days ago",
      desc: "Increased 1RM by 5kg with textbook hip hinge and lockout.",
      icon: Trophy,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "14-Day Consecutive Streak Milestone",
      date: "Yesterday",
      desc: "Maintained training consistency without missing a scheduled session.",
      icon: Flame,
      color: "text-[#b8ff32] bg-[#b8ff32]/10 border-[#b8ff32]/20",
    },
    {
      title: "Completed Sub-20 5K Time Trial",
      date: "2 weeks ago",
      desc: "Ran official 5,000m road course in 19m 42s.",
      icon: Activity,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Surpassed 35,000 Total Calories Burned",
      date: "Last month",
      desc: "Cumulative workout energy consumption logged on FitPulse Pro.",
      icon: Sparkles,
      color: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#b8ff32] px-4 py-3 text-xs font-black text-[#070908] shadow-2xl animate-in slide-in-from-bottom-4">
          <CheckCircle2 size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER & TIMEFRAME SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#b8ff32] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
              Biometric Exertion Analytics
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Performance & Progression Center
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Analyze progressive overload tonnage, caloric expenditure, and personal records.
          </p>
        </div>

        {/* Timeframe Pills */}
        <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 self-start sm:self-auto">
          {["7D", "30D", "90D"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`rounded-xl px-4 py-1.5 text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                timeframe === t
                  ? "bg-[#b8ff32] text-[#070908] shadow-[0_0_15px_rgba(184,255,50,0.3)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CORE PROGRESSION KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Dumbbell size={16} className="text-[#b8ff32]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Total Volume Load
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {timeframe === "7D" ? "50.0 t" : timeframe === "30D" ? "176.9 t" : "554.0 t"}
          </span>
          <p className="text-[10px] text-emerald-400 font-bold mt-1">
            ↑ +12.4% vs prev cycle
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Flame size={16} className="text-[#b8ff32]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Cumulative Burn
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {timeframe === "7D" ? "4,150" : timeframe === "30D" ? "17,900" : "61,100"} kcal
          </span>
          <p className="text-[10px] text-emerald-400 font-bold mt-1">
            ↑ +8.1% energy expenditure
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Clock size={16} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Active Time
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {timeframe === "7D" ? "6.8 hrs" : timeframe === "30D" ? "28.5 hrs" : "94.2 hrs"}
          </span>
          <p className="text-[10px] text-zinc-400 font-medium mt-1">
            High intensity duration
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Award size={16} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              All-Time PRs
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {prs.length} Records
          </span>
          <p className="text-[10px] text-[#b8ff32] font-bold mt-1">
            2 new PRs this month
          </p>
        </div>
      </div>

      {/* TWO CHARTS: VOLUME & CALORIES */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* CHART 1: PROGRESSIVE OVERLOAD TONNAGE */}
        <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Dumbbell size={18} className="text-[#b8ff32]" />
                <h2 className="text-base font-black uppercase tracking-tight text-white">
                  Progressive Overload Tonnage
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Total weight moved (Kg) across {timeframe} timeframe
              </p>
            </div>
            <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-mono text-[#b8ff32]">
              KG ACCUMULATION
            </span>
          </div>

          {/* SVG / CSS Bar Visualizer */}
          <div className="flex items-end justify-between gap-3 h-56 pt-6 pb-2">
            {volumeData.map((d, index) => {
              const heightPct = Math.round((d.val / maxVal) * 100);
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  <span className="text-[10px] font-mono font-bold text-zinc-400 mb-2 opacity-0 group-hover:opacity-100 transition">
                    {(d.val / 1000).toFixed(1)}t
                  </span>
                  <div className="w-full bg-white/5 rounded-xl h-full flex items-end p-1">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-emerald-500/80 to-[#b8ff32] group-hover:to-[#d0ff66] transition-all duration-500 shadow-[0_0_15px_rgba(184,255,50,0.2)]"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: CALORIE EXPENDITURE CURVE */}
        <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 sm:p-8 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-[#b8ff32]" />
                <h2 className="text-base font-black uppercase tracking-tight text-white">
                  Caloric Expenditure Dynamics
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Active strain burn (Kcal) distribution
              </p>
            </div>
            <span className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
              KCAL BURN
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 h-56 pt-6 pb-2">
            {volumeData.map((d, index) => {
              const maxKcal = Math.max(...volumeData.map((item) => item.kcal));
              const heightPct = Math.round((d.kcal / maxKcal) * 100);
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center h-full justify-end group"
                >
                  <span className="text-[10px] font-mono font-bold text-zinc-400 mb-2 opacity-0 group-hover:opacity-100 transition">
                    {d.kcal} kcal
                  </span>
                  <div className="w-full bg-white/5 rounded-xl h-full flex items-end p-1">
                    <div
                      className="w-full rounded-lg bg-gradient-to-t from-amber-500/80 to-[#b8ff32] group-hover:to-white transition-all duration-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. WORKOUT CONSISTENCY HEATMAP GRID */}
      <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
          <div>
            <h2 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Calendar size={18} className="text-[#b8ff32]" />
              35-Day Consistency Matrix
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Visual ledger of daily session execution and recovery blocks
            </p>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400">
            <span>Rest Day</span>
            <span className="h-3 w-3 rounded bg-white/5 border border-white/10" />
            <span className="h-3 w-3 rounded bg-[#b8ff32]/30" />
            <span className="h-3 w-3 rounded bg-[#b8ff32]/70" />
            <span className="h-3 w-3 rounded bg-[#b8ff32]" />
            <span>Heavy Load</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {heatmapDays.map((item) => {
            const colors = [
              "bg-white/5 border-white/10 text-zinc-500", // 0: rest
              "bg-[#b8ff32]/25 border-[#b8ff32]/40 text-[#b8ff32]", // 1: light
              "bg-[#b8ff32]/60 border-[#b8ff32]/80 text-[#070908] font-bold", // 2: moderate
              "bg-[#b8ff32] border-[#b8ff32] text-[#070908] font-black shadow-[0_0_10px_rgba(184,255,50,0.3)]", // 3: heavy
            ];
            return (
              <div
                key={item.day}
                className={`h-10 sm:h-12 rounded-xl border flex items-center justify-center text-xs transition hover:scale-105 cursor-pointer ${colors[item.intensity]}`}
                title={`Day ${item.day}: ${
                  item.intensity === 0
                    ? "Active Rest / Recovery"
                    : item.intensity === 1
                    ? "Light Mobility / Cardio"
                    : item.intensity === 2
                    ? "Moderate Strength Session"
                    : "Intense Hypertrophy Overload"
                }`}
              >
                <span>{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. PERSONAL RECORDS (PRS) & MILESTONES ROW */}
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
        {/* Personal Records Showcase */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Trophy size={20} className="text-amber-400" />
                Personal Records Hall of Fame
              </h2>
              <p className="text-xs text-zinc-400">All-time max load benchmarks</p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={() => setPrModalOpen(true)}
            >
              Log New PR
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {prs.map((pr) => (
              <div
                key={pr.id}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0c100d]/90 p-5 hover:border-amber-400/40 transition group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                      {pr.badge} Standard
                    </span>
                    <h4 className="text-sm font-black uppercase text-white mt-0.5 group-hover:text-amber-300 transition">
                      {pr.exercise}
                    </h4>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Trophy size={16} />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-mono">
                    {pr.weight}
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">
                    × {pr.reps} {pr.reps === 1 ? "Rep" : "Reps"}
                  </span>
                </div>

                <div className="mt-3 border-t border-white/5 pt-2 text-[10px] text-zinc-500 flex items-center justify-between">
                  <span>Logged {pr.date}</span>
                  <span className="text-emerald-400 font-bold">Verified PR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones Timeline */}
        <div>
          <div className="mb-5">
            <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Award size={20} className="text-[#b8ff32]" />
              Progression Timeline
            </h2>
            <p className="text-xs text-zinc-400">Recent major milestones achieved</p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {milestones.map((m, index) => {
              const Icon = m.icon;
              return (
                <div key={index} className="relative">
                  <div className="absolute -left-6 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#070908] border-2 border-[#b8ff32]" />
                  <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black uppercase text-white">
                        {m.title}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-semibold">
                        {m.date}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* LOG PR MODAL */}
      {prModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setPrModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
              Personal Record
            </span>
            <h3 className="text-2xl font-black uppercase text-white mt-1">
              Log Verified Milestone
            </h3>

            <form onSubmit={handleAddPR} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Exercise / Discipline
                </label>
                <input
                  type="text"
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                  placeholder="e.g. Overhead Strict Press"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Weight / Value
                  </label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="e.g. 85 kg or 19m 30s"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Repetitions
                  </label>
                  <input
                    type="number"
                    value={newReps}
                    onChange={(e) => setNewReps(e.target.value)}
                    min="1"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <Button type="submit" variant="primary" size="md" className="flex-1">
                  Save Personal Record
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setPrModalOpen(false)}
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
