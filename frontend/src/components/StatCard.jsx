import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({
  icon: Icon,
  title,
  value,
  unit = "",
  change,
  isPositive = true,
  subtext,
  accentColor = "#b8ff32",
  progress,
  className = "",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-[#0c100d]/90 border border-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:-translate-y-1 hover:shadow-xl ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {/* Subtle background glow */}
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 shrink-0"
              style={{ color: accentColor }}
            >
              <Icon size={20} />
            </div>
          )}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              {title}
            </p>
            {subtext && (
              <p className="text-[11px] text-zinc-500 font-medium">{subtext}</p>
            )}
          </div>
        </div>

        {change && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
              isPositive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-black tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {unit}
          </span>
        )}
      </div>

      {typeof progress === "number" && (
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-semibold text-zinc-400 mb-1.5">
            <span>Daily Goal</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
