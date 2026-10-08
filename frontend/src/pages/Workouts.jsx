import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  Plus,
  Search,
  Filter,
  Flame,
  Clock,
  Layers,
  Sparkles,
  Calendar,
  X,
  Trash2,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import WorkoutCard from "../components/WorkoutCard";
import Button from "../components/Button";
import workoutService from "../services/workoutService";
import { WORKOUT_CATEGORIES, DIFFICULTY_LEVELS } from "../utils/constants";
import { formatNumber } from "../utils/helpers";

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  // Add / Edit Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Strength");
  const [formDifficulty, setFormDifficulty] = useState("Intermediate");
  const [formDuration, setFormDuration] = useState(45);
  const [formCalories, setFormCalories] = useState(450);
  const [formDescription, setFormDescription] = useState("");
  const [formMuscles, setFormMuscles] = useState("Chest, Triceps");
  const [formExercises, setFormExercises] = useState([
    { name: "Barbell Bench Press", sets: 4, reps: 8, weight: 80 },
    { name: "Incline DB Press", sets: 3, reps: 10, weight: 30 },
  ]);

  // Details modal
  const [detailWorkout, setDetailWorkout] = useState(null);

  // Success toast state
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    async function loadWorkouts() {
      try {
        const data = await workoutService.getWorkouts();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to load workouts", err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkouts();
  }, []);

  // Filtered workouts
  const filteredWorkouts = workouts.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.exercises &&
        w.exercises.some((e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase())
        )) ||
      (w.targetMuscles &&
        w.targetMuscles.some((m) =>
          m.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    const matchesCategory =
      selectedCategory === "All" || w.category === selectedCategory;

    const matchesDifficulty =
      selectedDifficulty === "All" || w.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce(
    (sum, w) => sum + (parseInt(w.durationMinutes || w.duration, 10) || 45),
    0
  );
  const totalCalories = workouts.reduce(
    (sum, w) => sum + (parseInt(w.caloriesBurned || w.calories, 10) || 450),
    0
  );

  // Exercise row management in modal
  const handleAddExerciseRow = () => {
    setFormExercises([
      ...formExercises,
      { name: "", sets: 3, reps: 10, weight: 50 },
    ]);
  };

  const handleUpdateExerciseRow = (index, field, value) => {
    const updated = [...formExercises];
    updated[index][field] = value;
    setFormExercises(updated);
  };

  const handleRemoveExerciseRow = (index) => {
    setFormExercises(formExercises.filter((_, i) => i !== index));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormCategory("Strength");
    setFormDifficulty("Intermediate");
    setFormDuration(45);
    setFormCalories(450);
    setFormDescription("");
    setFormMuscles("Chest, Triceps");
    setFormExercises([
      { name: "Barbell Bench Press", sets: 4, reps: 8, weight: 80 },
    ]);
    setModalOpen(true);
  };

  const handleOpenEditModal = (workout) => {
    setEditingId(workout.id);
    setFormTitle(workout.title);
    setFormCategory(workout.category || "Strength");
    setFormDifficulty(workout.difficulty || "Intermediate");
    setFormDuration(parseInt(workout.durationMinutes || workout.duration, 10) || 45);
    setFormCalories(parseInt(workout.caloriesBurned || workout.calories, 10) || 450);
    setFormDescription(workout.description || "");
    setFormMuscles(
      workout.targetMuscles ? workout.targetMuscles.join(", ") : "Full Body"
    );
    setFormExercises(
      workout.exercises && workout.exercises.length > 0
        ? workout.exercises
        : [{ name: "Primary Lift", sets: 4, reps: 8, weight: 75 }]
    );
    setModalOpen(true);
  };

  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const musclesArray = formMuscles
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);

    const payload = {
      title: formTitle,
      category: formCategory,
      difficulty: formDifficulty,
      duration: `${formDuration} Min`,
      durationMinutes: parseInt(formDuration, 10),
      calories: `${formCalories} kcal`,
      caloriesBurned: parseInt(formCalories, 10),
      description: formDescription,
      targetMuscles: musclesArray.length ? musclesArray : ["Full Body"],
      exercisesCount: formExercises.length,
      exercises: formExercises,
      date: new Date().toISOString(),
    };

    if (editingId) {
      const updated = await workoutService.updateWorkout(editingId, payload);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === editingId ? { ...w, ...updated } : w))
      );
      showToast("Workout updated successfully!");
    } else {
      const created = await workoutService.createWorkout(payload);
      setWorkouts((prev) => [created, ...prev]);
      showToast("Workout session created successfully!");
    }

    setModalOpen(false);
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm("Are you sure you want to remove this workout?")) {
      await workoutService.deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      showToast("Workout removed.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#b8ff32] px-4 py-3 text-xs font-black text-[#070908] shadow-2xl animate-in slide-in-from-bottom-4">
          <CheckCircle2 size={16} strokeWidth={3} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#b8ff32] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
              Training Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Workout Protocols & History
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Build, execute, and monitor custom hypertrophy and endurance routines.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          iconPosition="left"
          onClick={handleOpenAddModal}
        >
          Build New Routine
        </Button>
      </div>

      {/* SUMMARY STATS BAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Dumbbell size={16} className="text-[#b8ff32]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Total Routines
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {totalWorkouts}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">All logged sessions</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Clock size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Total Minutes
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {formatNumber(totalMinutes)}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Under barbell & turf</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Flame size={16} className="text-[#b8ff32]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Total Burn
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {formatNumber(totalCalories)}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Active kilocalories</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Sparkles size={16} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Avg. Duration
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {totalWorkouts ? Math.round(totalMinutes / totalWorkouts) : 0}m
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Per training session</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by routine name, exercise, or muscle group..."
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 hidden sm:inline">
              Difficulty:
            </span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0e120f] py-2.5 px-3 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
            >
              <option value="All">All Difficulties</option>
              {DIFFICULTY_LEVELS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {WORKOUT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#b8ff32] text-[#070908]"
                  : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* WORKOUT LIST GRID */}
      {filteredWorkouts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((w) => (
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
              onStart={() => setDetailWorkout(w)}
              onEdit={() => handleOpenEditModal(w)}
              onDelete={() => handleDeleteWorkout(w.id)}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="rounded-3xl border border-dashed border-white/15 bg-zinc-950/50 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-zinc-400 mb-4">
            <Dumbbell size={24} />
          </div>
          <h3 className="text-lg font-black uppercase text-white">
            No Workouts Found
          </h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            {searchQuery || selectedCategory !== "All" || selectedDifficulty !== "All"
              ? "No workout matches your current filter or search criteria."
              : "You haven't logged any workouts yet. Create your first session now!"}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {(searchQuery || selectedCategory !== "All" || selectedDifficulty !== "All") && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setSelectedDifficulty("All");
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenAddModal}
            >
              Log New Workout
            </Button>
          </div>
        </div>
      )}

      {/* ADD / EDIT WORKOUT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8ff32]">
              {editingId ? "Modify Routine" : "Custom Protocol Builder"}
            </span>
            <h3 className="text-2xl font-black uppercase text-white mt-1">
              {editingId ? "Edit Workout Session" : "Create New Workout Session"}
            </h3>

            <form onSubmit={handleSaveWorkout} className="mt-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Workout Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Upper Body Dynamic Strength"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                />
              </div>

              {/* Category, Difficulty, Duration, Calories */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0e120f] py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  >
                    {WORKOUT_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0e120f] py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  >
                    {DIFFICULTY_LEVELS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Duration (m)
                  </label>
                  <input
                    type="number"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
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
                    value={formCalories}
                    onChange={(e) => setFormCalories(e.target.value)}
                    min="10"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>

              {/* Target Muscles */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Target Muscle Groups (comma-separated)
                </label>
                <input
                  type="text"
                  value={formMuscles}
                  onChange={(e) => setFormMuscles(e.target.value)}
                  placeholder="Chest, Front Delts, Triceps"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Protocol Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Training notes, intended RPE, or tempo notes..."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                />
              </div>

              {/* Exercise Items Table */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300">
                    Exercise Movement Sequence ({formExercises.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddExerciseRow}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#b8ff32] hover:underline"
                  >
                    <Plus size={13} />
                    <span>Add Movement</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {formExercises.map((ex, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1.5fr_0.6fr_0.6fr_0.7fr_auto] gap-2 items-center rounded-xl bg-white/[0.02] border border-white/5 p-2"
                    >
                      <input
                        type="text"
                        value={ex.name}
                        onChange={(e) =>
                          handleUpdateExerciseRow(index, "name", e.target.value)
                        }
                        placeholder="Exercise Name"
                        required
                        className="rounded-lg border border-white/10 bg-white/5 py-1.5 px-2 text-xs text-white focus:outline-none focus:border-[#b8ff32]"
                      />
                      <input
                        type="number"
                        value={ex.sets}
                        onChange={(e) =>
                          handleUpdateExerciseRow(index, "sets", parseInt(e.target.value, 10))
                        }
                        placeholder="Sets"
                        min="1"
                        className="rounded-lg border border-white/10 bg-white/5 py-1.5 px-2 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        value={ex.reps}
                        onChange={(e) =>
                          handleUpdateExerciseRow(index, "reps", parseInt(e.target.value, 10))
                        }
                        placeholder="Reps"
                        min="1"
                        className="rounded-lg border border-white/10 bg-white/5 py-1.5 px-2 text-xs text-white focus:outline-none"
                      />
                      <input
                        type="number"
                        value={ex.weight}
                        onChange={(e) =>
                          handleUpdateExerciseRow(index, "weight", parseFloat(e.target.value))
                        }
                        placeholder="Weight (kg)"
                        min="0"
                        className="rounded-lg border border-white/10 bg-white/5 py-1.5 px-2 text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExerciseRow(index)}
                        className="p-1 text-zinc-500 hover:text-rose-400 transition"
                        title="Remove row"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex gap-3 border-t border-white/10">
                <Button type="submit" variant="primary" size="md" className="flex-1">
                  {editingId ? "Update Routine" : "Save New Routine"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailWorkout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setDetailWorkout(null)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase text-[#b8ff32]">
                {detailWorkout.category}
              </span>
              <span className="text-[10px] font-bold text-zinc-400">
                Difficulty: {detailWorkout.difficulty}
              </span>
            </div>

            <h3 className="text-2xl font-black uppercase text-white">
              {detailWorkout.title}
            </h3>

            {detailWorkout.description && (
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {detailWorkout.description}
              </p>
            )}

            <div className="mt-5 grid grid-cols-3 gap-3 border-y border-white/10 py-3 text-center text-xs">
              <div>
                <span className="text-zinc-500 font-bold block">DURATION</span>
                <span className="font-black text-white">{detailWorkout.duration}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">EST. BURN</span>
                <span className="font-black text-[#b8ff32]">{detailWorkout.calories}</span>
              </div>
              <div>
                <span className="text-zinc-500 font-bold block">MOVEMENTS</span>
                <span className="font-black text-white">
                  {detailWorkout.exercises?.length || detailWorkout.exercisesCount} Exercises
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-black uppercase text-zinc-300 mb-3">
                Movement Sequence & Targets
              </h4>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {detailWorkout.exercises?.map((ex, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs"
                  >
                    <span className="font-bold text-white">{ex.name}</span>
                    <span className="font-mono text-[#b8ff32] font-semibold">
                      {ex.sets} Sets × {ex.reps || 10} Reps{" "}
                      {ex.weight ? `@ ${ex.weight} kg` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => {
                  showToast("Workout session launched into live tracker!");
                  setDetailWorkout(null);
                }}
              >
                Start Active Session
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => setDetailWorkout(null)}
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
