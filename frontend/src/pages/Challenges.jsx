import { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Flame,
  Sparkles,
  CheckCircle2,
  X,
  Award,
  Target,
} from "lucide-react";
import ChallengeCard from "../components/ChallengeCard";
import Button from "../components/Button";
import challengeService from "../services/challengeService";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [filterTab, setFilterTab] = useState("all"); // "all" | "active" | "available" | "completed"
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    async function loadChallenges() {
      try {
        const data = await challengeService.getChallenges();
        setChallenges(data);
      } catch (err) {
        console.error("Failed to load challenges", err);
      }
    }
    loadChallenges();
  }, []);

  const handleJoin = async (id) => {
    const updated = await challengeService.joinChallenge(id);
    if (updated) {
      setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast(`Joined challenge: ${updated.title}! Complete daily check-ins.`);
    }
  };

  const handleCheckIn = async (id) => {
    const updated = await challengeService.checkInChallenge(id);
    if (updated) {
      setChallenges((prev) => prev.map((c) => (c.id === id ? updated : c)));
      if (updated.completed) {
        showToast(`🏆 Congratulations! You conquered ${updated.title}!`);
      } else {
        showToast(`Check-in recorded! Progress: ${updated.progress}%`);
      }
    }
  };

  const filteredChallenges = challenges.filter((c) => {
    const isDone = c.completed || c.progress >= 100;
    if (filterTab === "active") return c.joined && !isDone;
    if (filterTab === "available") return !c.joined;
    if (filterTab === "completed") return isDone;
    return true;
  });

  const activeCount = challenges.filter((c) => c.joined && !c.completed && c.progress < 100).length;
  const availableCount = challenges.filter((c) => !c.joined).length;
  const completedCount = challenges.filter((c) => c.completed || c.progress >= 100).length;
  const totalAthletes = challenges.reduce((sum, c) => sum + (c.participants || 0), 0);

  // Leaderboard mock
  const leaderboard = [
    { rank: 1, name: "Marcus Thorne", score: "2,450 pts", streak: "28d", tier: "Gold" },
    { rank: 2, name: "Elena Rostova", score: "2,380 pts", streak: "24d", tier: "Gold" },
    { rank: 3, name: "Alex Vance (You)", score: "2,190 pts", streak: "14d", tier: "Silver" },
    { rank: 4, name: "Liam Chen", score: "1,940 pts", streak: "18d", tier: "Bronze" },
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

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#b8ff32] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
              Community Crucible
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Fitness Challenges & Badges
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Compete in time-capped trials, earn verified badges, and climb the leaderboard.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Flame size={16} className="text-[#b8ff32]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Active Challenges
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#b8ff32]">
            {activeCount}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Currently enrolled</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Target size={16} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Available Trials
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {availableCount}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Ready for enrollment</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Trophy size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Conquered Badges
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
            {completedCount}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Trophies unlocked</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Users size={16} className="text-sky-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Athletes Competing
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {totalAthletes.toLocaleString()}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Global participation</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: `All Challenges (${challenges.length})` },
          { id: "active", label: `Active (${activeCount})` },
          { id: "available", label: `Available (${availableCount})` },
          { id: "completed", label: `Completed (${completedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
              filterTab === tab.id
                ? "bg-[#b8ff32] text-[#070908] shadow-[0_0_15px_rgba(184,255,50,0.3)]"
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8">
        {/* Left: Challenge Cards Grid */}
        <div className="space-y-6">
          {filteredChallenges.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredChallenges.map((c) => (
                <div key={c.id} onClick={() => setSelectedChallenge(c)} className="cursor-pointer">
                  <ChallengeCard
                    title={c.title}
                    category={c.category}
                    reward={c.reward}
                    description={c.description}
                    participants={c.participants}
                    daysLeft={c.daysLeft}
                    progress={c.progress}
                    joined={c.joined}
                    completed={c.completed}
                    onJoin={(e) => {
                      if (e && e.stopPropagation) e.stopPropagation();
                      handleJoin(c.id);
                    }}
                    onCheckIn={(e) => {
                      if (e && e.stopPropagation) e.stopPropagation();
                      handleCheckIn(c.id);
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-zinc-950/50 p-12 text-center">
              <Trophy size={28} className="mx-auto text-zinc-500 mb-3" />
              <h3 className="text-base font-black uppercase text-white">
                No Challenges in this Category
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Switch filters to see active or available fitness challenges.
              </p>
              <div className="mt-4">
                <Button variant="secondary" size="sm" onClick={() => setFilterTab("all")}>
                  Show All Challenges
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Leaderboard & Season Awards */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <Award size={18} className="text-amber-400" />
                  Crucible Leaderboard
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Season 4 Global Ranking</p>
              </div>
              <span className="text-[10px] font-bold text-[#b8ff32] uppercase tracking-wider">
                Live Ranks
              </span>
            </div>

            <div className="space-y-3">
              {leaderboard.map((lb) => (
                <div
                  key={lb.rank}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 transition ${
                    lb.name.includes("You")
                      ? "border-[#b8ff32]/50 bg-[#b8ff32]/10"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-xl text-xs font-black ${
                        lb.rank === 1
                          ? "bg-amber-400 text-[#070908]"
                          : lb.rank === 2
                          ? "bg-zinc-300 text-[#070908]"
                          : lb.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      #{lb.rank}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-white">{lb.name}</h4>
                      <span className="text-[10px] text-zinc-400">{lb.streak} streak</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">
                      {lb.score}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-[#b8ff32]">
                      {lb.tier} Tier
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reward Badges Showcase */}
          <div className="rounded-3xl border border-white/10 bg-[#0c100d]/90 p-6 backdrop-blur-xl">
            <h3 className="text-sm font-black uppercase tracking-wider text-white mb-3">
              Featured Rewards This Cycle
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Trophy size={18} />
                </span>
                <div>
                  <span className="font-black text-white block">Iron Chest Badge</span>
                  <span className="text-[10px] text-zinc-400">Century Push-up Blitz conquest</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  <Sparkles size={18} />
                </span>
                <div>
                  <span className="font-black text-white block">Aero Runner Trophy</span>
                  <span className="text-[10px] text-zinc-400">Sub-20 5K road sprint trial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHALLENGE DETAILS MODAL */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setSelectedChallenge(null)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-amber-400">
                Reward: {selectedChallenge.reward}
              </span>
              <span className="text-[10px] font-bold text-zinc-400">
                {selectedChallenge.category}
              </span>
            </div>

            <h3 className="text-2xl font-black uppercase text-white mt-1">
              {selectedChallenge.title}
            </h3>

            <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
              {selectedChallenge.description}
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-white/10 py-3 text-center text-xs">
              <div>
                <span className="text-zinc-500 font-bold block">PARTICIPANTS</span>
                <span className="font-black text-white">
                  {selectedChallenge.participants.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">TIME LEFT</span>
                <span className="font-black text-[#b8ff32]">
                  {selectedChallenge.daysLeft} Days
                </span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">COMPLETION</span>
                <span className="font-black text-white">
                  {selectedChallenge.progress}%
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {selectedChallenge.joined ? (
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    handleCheckIn(selectedChallenge.id);
                    setSelectedChallenge(null);
                  }}
                >
                  Log Daily Check-in
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => {
                    handleJoin(selectedChallenge.id);
                    setSelectedChallenge(null);
                  }}
                >
                  Join Challenge Now
                </Button>
              )}
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedChallenge(null)}
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
