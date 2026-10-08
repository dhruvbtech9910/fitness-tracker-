import { Target, Calendar, ChevronRight, CheckCircle2, Pencil, Trash2 } from "lucide-react";

export default function GoalCard({
  title,
  category = "Strength",
  current,
  target,
  unit = "kg",
  deadline,
  progress = 0,
  status = "in-progress",
  notes,
  onUpdate,
  onEdit,
  onDelete,
  className = "",
}) {
  const percentage = Math.min(Math.max(progress, 0), 100);
  const isCompleted = status === "completed" || percentage >= 100;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#0c100d]/90 border p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
        isCompleted
          ? "border-emerald-500/40 bg-emerald-950/10 shadow-[0_4px_20px_rgba(16,185,129,0.1)]"
          : "border-white/10 hover:border-white/20"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
              isCompleted
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                : "bg-[#b8ff32]/10 text-[#b8ff32] border-[#b8ff32]/20"
            }`}
          >
            {isCompleted ? <CheckCircle2 size={18} /> : <Target size={18} />}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
              {category}
            </span>
            <h4 className="text-base font-black uppercase tracking-tight text-white">
              {title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-black ${
              isCompleted ? "text-emerald-400" : "text-[#b8ff32]"
            }`}
          >
            {percentage}%
          </span>
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-1 rounded text-zinc-500 hover:text-white transition"
              title="Edit Goal"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1 rounded text-zinc-500 hover:text-rose-400 transition"
              title="Delete Goal"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {notes && (
        <p className="mt-2 text-xs text-zinc-400 italic font-medium">
          "{notes}"
        </p>
      )}

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                : "bg-gradient-to-r from-emerald-400 to-[#b8ff32]"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Numerical Stats */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div>
          <span className="text-zinc-500 font-medium">Current: </span>
          <span className="font-bold text-white">
            {current} {unit}
          </span>
        </div>
        <div>
          <span className="text-zinc-500 font-medium">Target: </span>
          <span className={`font-bold ${isCompleted ? "text-emerald-400" : "text-[#b8ff32]"}`}>
            {target} {unit}
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <Calendar size={12} />
          <span>{deadline}</span>
        </div>

        {onUpdate && (
          <button
            onClick={onUpdate}
            className="flex items-center gap-1 text-[11px] font-bold text-zinc-300 hover:text-[#b8ff32] transition cursor-pointer"
          >
            <span>Update Value</span>
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
