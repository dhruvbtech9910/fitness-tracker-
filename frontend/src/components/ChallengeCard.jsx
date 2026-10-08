import { Trophy, Users, Clock, Check, Sparkles, CheckCircle2 } from "lucide-react";

export default function ChallengeCard({
  title,
  category = "Strength",
  reward = "Badge",
  description,
  participants = 120,
  daysLeft = 7,
  progress = 0,
  joined = false,
  completed = false,
  onJoin,
  onCheckIn,
  className = "",
}) {
  const isFinished = completed || progress >= 100;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-[#0c100d]/90 border p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
        isFinished
          ? "border-emerald-500/40 bg-emerald-950/15"
          : joined
          ? "border-[#b8ff32]/40 shadow-[0_4px_25px_rgba(184,255,50,0.12)]"
          : "border-white/10 hover:border-white/25"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
              isFinished
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {isFinished ? <CheckCircle2 size={22} /> : <Trophy size={20} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <Sparkles size={11} />
                Reward: {reward}
              </span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase">
                • {category}
              </span>
            </div>
            <h4 className="text-base font-black uppercase tracking-tight text-white group-hover:text-[#b8ff32] transition">
              {title}
            </h4>
          </div>
        </div>

        {isFinished ? (
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-400">
            Conquered
          </span>
        ) : joined ? (
          <span className="rounded-full bg-[#b8ff32]/20 border border-[#b8ff32]/40 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#b8ff32]">
            Active
          </span>
        ) : null}
      </div>

      {description && (
        <p className="mt-2.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {description}
        </p>
      )}

      {/* Progress Bar if joined */}
      {joined && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-bold text-zinc-400 mb-1">
            <span>Completion</span>
            <span className={isFinished ? "text-emerald-400 font-black" : "text-[#b8ff32]"}>
              {progress}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFinished ? "bg-emerald-400" : "bg-[#b8ff32]"
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Meta stats */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Users size={12} className="text-zinc-500" />
            {participants.toLocaleString()} athletes
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-zinc-500" />
            {daysLeft}d left
          </span>
        </div>

        {isFinished ? (
          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <Check size={14} strokeWidth={3} />
            <span>Completed</span>
          </div>
        ) : joined ? (
          <button
            onClick={onCheckIn}
            className="flex items-center gap-1.5 rounded-lg bg-[#b8ff32] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#070908] hover:bg-[#c9ff4d] transition cursor-pointer active:scale-95"
          >
            <Check size={12} strokeWidth={3} />
            Check-in
          </button>
        ) : (
          <button
            onClick={onJoin}
            className="rounded-lg bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-white hover:bg-white/20 hover:border-white/30 border border-white/10 transition cursor-pointer active:scale-95"
          >
            Join Challenge
          </button>
        )}
      </div>
    </div>
  );
}
