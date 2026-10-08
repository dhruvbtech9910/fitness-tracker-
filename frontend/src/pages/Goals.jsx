import React, { useState, useEffect } from "react";
import {
  Target,
  Plus,
  Trophy,
  CheckCircle2,
  Calendar,
  X,
  TrendingUp,
  Sparkles,
  Award,
  Filter,
} from "lucide-react";
import GoalCard from "../components/GoalCard";
import Button from "../components/Button";
import goalService from "../services/goalService";
import { GOAL_CATEGORIES } from "../utils/constants";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "completed"

  // Create / Edit modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("Strength");
  const [formCurrent, setFormCurrent] = useState("");
  const [formTarget, setFormTarget] = useState("");
  const [formUnit, setFormUnit] = useState("kg");
  const [formDeadline, setFormDeadline] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Quick Update Progress modal state
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [updatingGoal, setUpdatingGoal] = useState(null);
  const [quickUpdateValue, setQuickUpdateValue] = useState("");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    async function loadGoals() {
      try {
        const data = await goalService.getGoals();
        setGoals(data);
      } catch (err) {
        console.error("Failed to load goals", err);
      } finally {
        setLoading(false);
      }
    }
    loadGoals();
  }, []);

  // Filtered goals
  const filteredGoals = goals.filter((g) => {
    const matchesCategory =
      selectedCategory === "All" || g.category === selectedCategory;

    const isDone = g.status === "completed" || g.progress >= 100;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && !isDone) ||
      (statusFilter === "completed" && isDone);

    return matchesCategory && matchesStatus;
  });

  const totalGoals = goals.length;
  const completedCount = goals.filter(
    (g) => g.status === "completed" || g.progress >= 100
  ).length;
  const activeCount = totalGoals - completedCount;
  const completionRate = totalGoals
    ? Math.round((completedCount / totalGoals) * 100)
    : 0;

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormTitle("");
    setFormCategory("Strength");
    setFormCurrent(80);
    setFormTarget(100);
    setFormUnit("kg");
    setFormDeadline("Dec 31, 2026");
    setFormNotes("");
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (goal) => {
    setEditingId(goal.id);
    setFormTitle(goal.title);
    setFormCategory(goal.category);
    setFormCurrent(goal.current);
    setFormTarget(goal.target);
    setFormUnit(goal.unit || "kg");
    setFormDeadline(goal.deadline);
    setFormNotes(goal.notes || "");
    setModalOpen(true);
  };

  // Save Goal
  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const payload = {
      title: formTitle,
      category: formCategory,
      current: parseFloat(formCurrent) || 0,
      target: parseFloat(formTarget) || 100,
      unit: formUnit,
      deadline: formDeadline || "In 30 days",
      notes: formNotes,
    };

    if (editingId) {
      const updated = await goalService.updateGoal(editingId, payload);
      setGoals((prev) =>
        prev.map((g) => (g.id === editingId ? { ...g, ...updated } : g))
      );
      showToast("Goal updated successfully!");
    } else {
      const created = await goalService.createGoal(payload);
      setGoals((prev) => [created, ...prev]);
      showToast("New fitness target created!");
    }

    setModalOpen(false);
  };

  // Delete Goal
  const handleDeleteGoal = async (id) => {
    if (window.confirm("Are you sure you want to delete this target?")) {
      await goalService.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
      showToast("Goal removed.");
    }
  };

  // Quick progress update
  const handleOpenUpdateModal = (goal) => {
    setUpdatingGoal(goal);
    setQuickUpdateValue(goal.current);
    setUpdateModalOpen(true);
  };

  const handleSaveQuickProgress = async (e) => {
    e.preventDefault();
    if (!updatingGoal) return;

    const newVal = parseFloat(quickUpdateValue);
    const updated = await goalService.updateGoal(updatingGoal.id, {
      current: newVal,
    });

    setGoals((prev) =>
      prev.map((g) => (g.id === updatingGoal.id ? { ...g, ...updated } : g))
    );

    setUpdateModalOpen(false);
    showToast("Progress logged!");
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

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#b8ff32] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#b8ff32]">
              Milestone Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Fitness Targets & Goals
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Define quantifiable physical benchmarks and track linear progression.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          iconPosition="left"
          onClick={handleOpenCreateModal}
        >
          Create New Target
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Target size={16} className="text-[#b8ff32]" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Total Targets
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {totalGoals}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Active + Finished</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <TrendingUp size={16} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              In Progress
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {activeCount}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Under execution</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Completed
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
            {completedCount}
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Milestones smashed</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4">
          <div className="flex items-center gap-2 text-zinc-400 mb-2">
            <Trophy size={16} className="text-purple-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Smash Rate
            </span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">
            {completionRate}%
          </span>
          <p className="text-[10px] text-zinc-500 font-medium mt-1">Goal completion %</p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="rounded-2xl border border-white/10 bg-[#0c100d]/90 p-4 space-y-3">
        {/* Status Filters */}
        <div className="flex items-center justify-between flex-wrap gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
              Status:
            </span>
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              {[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "completed", label: "Completed" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                    statusFilter === tab.id
                      ? "bg-[#b8ff32] text-[#070908]"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {GOAL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
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

      {/* GOALS GRID */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map((g) => (
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
              onUpdate={() => handleOpenUpdateModal(g)}
              onEdit={() => handleOpenEditModal(g)}
              onDelete={() => handleDeleteGoal(g.id)}
            />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="rounded-3xl border border-dashed border-white/15 bg-zinc-950/50 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-zinc-400 mb-4">
            <Target size={24} />
          </div>
          <h3 className="text-lg font-black uppercase text-white">
            No Targets Found
          </h3>
          <p className="mt-1 text-xs text-zinc-400 max-w-sm mx-auto">
            {selectedCategory !== "All" || statusFilter !== "all"
              ? "No goal matches your selected category or status filter."
              : "You have not set any fitness targets yet. Establish your first benchmark!"}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {(selectedCategory !== "All" || statusFilter !== "all") && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenCreateModal}
            >
              Create First Target
            </Button>
          </div>
        </div>
      )}

      {/* CREATE / EDIT GOAL MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8ff32]">
              {editingId ? "Update Target" : "Target Formulation"}
            </span>
            <h3 className="text-2xl font-black uppercase text-white mt-1">
              {editingId ? "Edit Fitness Goal" : "Set New Fitness Goal"}
            </h3>

            <form onSubmit={handleSaveGoal} className="mt-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Goal Title
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. 100kg Strict Bench Press"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0e120f] py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  >
                    {GOAL_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Unit of Measurement
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    placeholder="kg, reps, min, km, days"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Current Metric
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formCurrent}
                    onChange={(e) => setFormCurrent(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                    Target Metric
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-xs text-white focus:border-[#b8ff32] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Target Deadline
                </label>
                <input
                  type="text"
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  placeholder="e.g. Dec 31, 2026 or 4 Weeks"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Training Notes / Strategy (Optional)
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Running linear progression protocol with 2.5kg micro-plates."
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#b8ff32] focus:outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-white/10">
                <Button type="submit" variant="primary" size="md" className="flex-1">
                  {editingId ? "Update Target" : "Save Target"}
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

      {/* QUICK UPDATE PROGRESS MODAL */}
      {updateModalOpen && updatingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-950 p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setUpdateModalOpen(false)}
              className="absolute right-6 top-6 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#b8ff32]">
              Quick Log Progress
            </span>
            <h3 className="text-xl font-black uppercase text-white mt-1">
              {updatingGoal.title}
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Target: {updatingGoal.target} {updatingGoal.unit}
            </p>

            <form onSubmit={handleSaveQuickProgress} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Current Value ({updatingGoal.unit})
                </label>
                <input
                  type="number"
                  step="any"
                  value={quickUpdateValue}
                  onChange={(e) => setQuickUpdateValue(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm font-black text-[#b8ff32] focus:border-[#b8ff32] focus:outline-none"
                />
              </div>

              {/* Quick increment buttons */}
              <div className="flex gap-2">
                {[1, 5, 10].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() =>
                      setQuickUpdateValue((prev) =>
                        (parseFloat(prev || 0) + inc).toString()
                      )
                    }
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 py-1.5 text-xs font-bold text-zinc-300 hover:text-white hover:border-[#b8ff32]"
                  >
                    +{inc} {updatingGoal.unit}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setQuickUpdateValue(updatingGoal.target.toString())}
                  className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30"
                >
                  Mark 100%
                </button>
              </div>

              <div className="pt-3 flex gap-3">
                <Button type="submit" variant="primary" size="md" className="flex-1">
                  Save Progress
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setUpdateModalOpen(false)}
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
