import { Clock, Flame, Dumbbell, ArrowUpRight, Pencil, Trash2, Calendar } from "lucide-react";
import { formatRelativeDate } from "../utils/helpers";

export default function WorkoutCard({
  title,
  category = "Strength",
  duration = "45 Min",
  calories = "450 kcal",
  difficulty = "Intermediate",
  exercisesCount = 5,
  targetMuscles = [],
  isPopular = false,
  date,
  description,
  onStart,
  onEdit,
  onDelete,
  className = "",
}) {
  const difficultyColors = {
    Beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    Intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    Advanced: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    Elite: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0c100d]/90 border border-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#b8ff32]/50 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Featured badge */}
      {isPopular && (
        <div className="absolute right-4 top-4 rounded-full bg-[#b8ff32] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#070908]">
          Featured
        </div>
      )}

      <div>
        {/* Header tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-zinc-300 border border-white/10">
            {category}
          </span>
          <span
            className={`rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
              difficultyColors[difficulty] || difficultyColors.Intermediate
            }`}
          >
            {difficulty}
          </span>
          {date && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 ml-auto">
              <Calendar size={11} />
              {formatRelativeDate(date)}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black uppercase tracking-tight text-white transition-colors group-hover:text-[#b8ff32]">
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-y border-white/5 py-3 text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-[#b8ff32] shrink-0" />
            <span className="text-xs font-bold text-white truncate">{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={13} className="text-[#b8ff32] shrink-0" />
            <span className="text-xs font-bold text-white truncate">{calories}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Dumbbell size={13} className="text-[#b8ff32] shrink-0" />
            <span className="text-xs font-bold text-white truncate">{exercisesCount} Moves</span>
          </div>
        </div>

        {/* Target Muscles */}
        {targetMuscles && targetMuscles.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {targetMuscles.map((muscle) => (
              <span
                key={muscle}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-400"
              >
                {muscle}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action footer */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:border-white/30 transition cursor-pointer"
              title="Edit Workout"
            >
              <Pencil size={13} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
              title="Delete Workout"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        <button
          onClick={onStart}
          className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 group-hover:bg-[#b8ff32] group-hover:text-[#070908] cursor-pointer"
          title="Start or View Workout"
        >
          <span>View Routine</span>
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
