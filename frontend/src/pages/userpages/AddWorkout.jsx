import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Dumbbell,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Layers,
  X,
  Save,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

const AddWorkout = () => {
  const [category, setCategory] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Form Modal (Add / Edit)
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    workoutName: "",
    exerciseName: "",
    sets: "",
    reps: "",
    weight: "",
    notes: "",
    category: "",
    tags: "",
  });

  // Delete Modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load Categories
  const getCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/category");
      setCategory(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load workout categories");
    }
  };

  // Load Workouts
  const getWorkouts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/workout");
      setWorkouts(res.data.workoutlists || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
    getWorkouts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      workoutName: "",
      exerciseName: "",
      sets: "",
      reps: "",
      weight: "",
      notes: "",
      category: category.length > 0 ? category[0]._id : "",
      tags: "",
    });
    setEditId(null);
    setShowModal(false);
  };

  const openAddModal = () => {
    resetForm();
    if (category.length > 0) {
      setFormData((prev) => ({ ...prev, category: category[0]._id }));
    }
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item._id);
    const catId = typeof item.category === "object" ? item.category?._id : item.category;
    setFormData({
      workoutName: item.workoutName || "",
      exerciseName: item.exerciseName || "",
      sets: item.sets || "",
      reps: item.reps || "",
      weight: item.weight || "",
      notes: item.notes || "",
      category: catId || "",
      tags: item.tags || "",
    });
    setShowModal(true);
  };

  // Submit Add / Update Workout
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.workoutName.trim() ||
      !formData.exerciseName.trim() ||
      formData.sets === "" ||
      formData.reps === "" ||
      formData.weight === "" ||
      !formData.category
    ) {
      toast.error("Please fill all required workout fields");
      return;
    }

    try {
      setFormLoading(true);

      const payload = {
        workoutName: formData.workoutName.trim(),
        exerciseName: formData.exerciseName.trim(),
        sets: Number(formData.sets),
        reps: Number(formData.reps),
        weight: Number(formData.weight),
        notes: formData.notes.trim(),
        category: formData.category,
        tags: formData.tags.trim(),
      };

      if (editId) {
        const res = await axios.put(
          `http://localhost:5000/workout/${editId}`,
          payload
        );
        toast.success("Workout updated successfully");
        setWorkouts((prev) =>
          prev.map((item) => (item._id === editId ? res.data.workout : item))
        );
      } else {
        const res = await axios.post("http://localhost:5000/workout", payload);
        toast.success("Workout added successfully");
        setWorkouts((prev) => [res.data.workout, ...prev]);
      }

      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save workout");
    } finally {
      setFormLoading(false);
    }
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await axios.delete(`http://localhost:5000/workout/${deleteTarget._id}`);
      toast.success("Workout deleted successfully");
      setWorkouts((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete workout");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Filtered Workouts
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((item) => {
      // Category filter
      const catId = typeof item.category === "object" ? item.category?._id : item.category;
      if (selectedCategory !== "all" && catId !== selectedCategory) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const matchesName = (item.workoutName || "").toLowerCase().includes(q);
        const matchesExercise = (item.exerciseName || "").toLowerCase().includes(q);
        const matchesTags = (item.tags || "").toLowerCase().includes(q);
        return matchesName || matchesExercise || matchesTags;
      }
      return true;
    });
  }, [workouts, selectedCategory, searchTerm]);

  // Category name resolver
  const getCategoryName = (catValue) => {
    if (typeof catValue === "object" && catValue?.categoryName) {
      return catValue.categoryName;
    }
    const found = category.find((c) => c._id === catValue);
    return found ? found.categoryName : "—";
  };

  return (
    <div className="space-y-6 text-white animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            TRAINING SCHEDULE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Workout Exercises
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Manage your daily exercise routines, sets, reps, and resistance targets
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition duration-300 shadow-lg shadow-orange-500/20 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span>Add Workout</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Total Workouts */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Total Workouts</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {filteredWorkouts.length}
              </span>
              <span className="text-xs font-medium text-gray-500">
                / {workouts.length} total
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Filtered routines</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 ml-4">
            <Dumbbell size={22} />
          </div>
        </div>

        {/* Card 2: Categories Active */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Categories Active</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-400 tracking-tight">
                {category.length}
              </span>
              <span className="text-xs font-medium text-gray-500">splits</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Training muscle groups</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 ml-4">
            <Layers size={22} />
          </div>
        </div>

        {/* Card 3: Avg Volume / Exercise */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Avg Volume / Exercise</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight">
                {workouts.length > 0
                  ? (
                      workouts.reduce(
                        (acc, w) =>
                          acc +
                          Number(w.weight || 0) *
                            Number(w.sets || 0) *
                            Number(w.reps || 0),
                        0
                      ) / workouts.length
                    ).toFixed(0)
                  : 0}
              </span>
              <span className="text-xs font-medium text-gray-500">kg volume</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Average load per routine</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 ml-4">
            <Layers size={22} />
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH CONTROLS ── */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="w-full sm:w-auto flex-1 flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search exercise, workout or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-xs sm:text-sm transition"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-xs sm:text-sm transition cursor-pointer"
            >
              <option value="all">All Categories</option>
              {category.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || selectedCategory !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 text-xs font-bold transition self-end sm:self-auto"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* ── WORKOUTS TABLE ── */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-5">#</th>
                <th className="py-4 px-5">Workout Name</th>
                <th className="py-4 px-5">Exercise</th>
                <th className="py-4 px-5">Sets</th>
                <th className="py-4 px-5">Reps</th>
                <th className="py-4 px-5">Weight</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Tags</th>
                <th className="py-4 px-5">Notes</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span>Loading workout exercises...</span>
                  </td>
                </tr>
              ) : filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((item, index) => (
                  <tr key={item._id || index} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 text-gray-500 font-mono text-xs">
                      {index + 1}
                    </td>
                    <td className="py-4 px-5 font-bold text-white max-w-[160px] truncate">
                      {item.workoutName}
                    </td>
                    <td className="py-4 px-5 font-semibold text-gray-200">
                      {item.exerciseName}
                    </td>
                    <td className="py-4 px-5 font-bold text-blue-400 text-xs">
                      {item.sets}
                    </td>
                    <td className="py-4 px-5 font-bold text-emerald-400 text-xs">
                      {item.reps}
                    </td>
                    <td className="py-4 px-5 font-extrabold text-orange-400">
                      {item.weight} <span className="text-[10px] text-gray-500 font-normal">kg</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                        {getCategoryName(item.category)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-400 text-xs">
                      {item.tags || "—"}
                    </td>
                    <td className="py-4 px-5 text-gray-400 text-xs max-w-xs truncate">
                      {item.notes || "—"}
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400 border border-white/10 hover:border-orange-500/30 text-xs font-semibold transition"
                          title="Edit workout"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition"
                          title="Delete workout"
                        >
                          <Trash2 size={13} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-16 text-center text-gray-500">
                    <Dumbbell size={40} className="mx-auto mb-3 text-gray-600" />
                    <p className="font-bold text-gray-300 text-base">
                      {searchTerm || selectedCategory !== "all"
                        ? "No workouts match your filters"
                        : "No workouts recorded yet"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      {searchTerm || selectedCategory !== "all"
                        ? "Try clearing your search or category filter to view all exercises."
                        : "Click 'Add Workout' to record sets, repetitions, and weights."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD / EDIT WORKOUT MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-xl bg-[#16161d] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Dumbbell size={16} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {editId ? "Edit Workout Exercise" : "Add Workout Exercise"}
                </h3>
              </div>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Workout Name *
                  </label>
                  <input
                    type="text"
                    name="workoutName"
                    value={formData.workoutName}
                    onChange={handleChange}
                    placeholder="e.g. Chest Day, Upper Body Split"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Exercise Name *
                  </label>
                  <input
                    type="text"
                    name="exerciseName"
                    value={formData.exerciseName}
                    onChange={handleChange}
                    placeholder="e.g. Incline Dumbbell Press"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-blue-400 mb-1.5">
                    Sets *
                  </label>
                  <input
                    type="number"
                    name="sets"
                    value={formData.sets}
                    onChange={handleChange}
                    placeholder="4"
                    min="1"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0e13] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-emerald-400 mb-1.5">
                    Reps *
                  </label>
                  <input
                    type="number"
                    name="reps"
                    value={formData.reps}
                    onChange={handleChange}
                    placeholder="12"
                    min="1"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0e13] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-orange-400 mb-1.5">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="30"
                    min="0"
                    step="0.5"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0e13] border border-white/10 text-white text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                  >
                    <option value="">Select Category</option>
                    {category.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g. Strength, Hypertrophy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Form Notes / Tips
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g. Focus on deep stretch at bottom of rep, 90 sec rest"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>
                    {formLoading
                      ? "Saving..."
                      : editId
                      ? "Update Workout"
                      : "Add Workout"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE WORKOUT MODAL ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-md bg-[#16161d] border border-red-500/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Workout</h3>
                <p className="text-xs text-gray-400">Confirm permanent deletion</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-white">
                "{deleteTarget.exerciseName}" ({deleteTarget.workoutName})
              </span>
              ? This action cannot be reversed.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete Workout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWorkout;