import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Dumbbell,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Tag,
  Folder,
  Layers,
  Repeat,
  Weight,
} from "lucide-react";

const AdminWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    workoutName: "",
    exerciseName: "",
    sets: 3,
    reps: 12,
    weight: 20,
    category: "",
    notes: "",
    tags: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/admin/workouts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkouts(res.data.workouts || []);
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      workoutName: "",
      exerciseName: "",
      sets: 3,
      reps: 12,
      weight: 20,
      category: categories[0]?._id || "",
      notes: "",
      tags: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (w) => {
    setEditId(w._id);
    setFormData({
      workoutName: w.workoutName || "",
      exerciseName: w.exerciseName || "",
      sets: w.sets || 3,
      reps: w.reps || 12,
      weight: w.weight || 0,
      category: w.category?._id || w.category || categories[0]?._id || "",
      notes: w.notes || "",
      tags: w.tags || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        // Edit Workout
        const res = await axios.put(
          `http://localhost:5000/admin/workouts/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message || "Workout updated successfully");
      } else {
        // Add Workout
        const res = await axios.post(
          "http://localhost:5000/admin/workouts",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message || "Workout added successfully");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save workout");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/admin/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Workout deleted");
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete workout");
    }
  };

  const filteredWorkouts = workouts.filter((w) => {
    const q = search.toLowerCase();
    return (
      w.workoutName?.toLowerCase().includes(q) ||
      w.exerciseName?.toLowerCase().includes(q) ||
      w.category?.categoryName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0d0d12] p-5 sm:p-8 text-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-orange-400">
              Training Database
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
              Workouts & Exercises ({workouts.length})
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Create, view, edit, and organize platform workouts and exercises.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                type="text"
                placeholder="Search workouts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#14141a] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition active:scale-95"
            >
              <Plus size={18} />
              Add Workout
            </button>
          </div>
        </div>

        {/* Workouts Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#14141a] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-6 py-4">Workout / Routine</th>
                  <th className="px-6 py-4">Exercise</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Sets & Reps</th>
                  <th className="px-6 py-4">Weight</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400">
                      Loading workouts...
                    </td>
                  </tr>
                ) : filteredWorkouts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">
                      No workouts found. Click "Add Workout" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredWorkouts.map((w) => (
                    <tr key={w._id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400">
                            <Dumbbell size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{w.workoutName}</p>
                            {w.notes && (
                              <p className="text-xs text-gray-400 max-w-xs truncate">{w.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-200">{w.exerciseName}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-orange-300 border border-white/10">
                          {w.category?.categoryName || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {w.sets} sets × {w.reps} reps
                      </td>
                      <td className="px-6 py-4 font-bold text-white">{w.weight} kg</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-400">{w.tags || "—"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(w)}
                            title="Edit Workout"
                            className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10 transition"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            onClick={() => handleDelete(w._id)}
                            title="Delete Workout"
                            className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD / EDIT WORKOUT MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#14141a] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Dumbbell size={20} className="text-orange-400" />
                  {editId ? "Edit Workout Exercise" : "Add New Workout Exercise"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Routine / Workout Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chest & Triceps Blast"
                      value={formData.workoutName}
                      onChange={(e) => setFormData({ ...formData, workoutName: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Exercise Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Incline Bench Press"
                      value={formData.exerciseName}
                      onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Sets</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.sets}
                      onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Reps</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.reps}
                      onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Weight (kg)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Workout Category</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Hypertrophy, Upper Body"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Notes & Instructions (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Focus on deep stretch at the bottom"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : editId ? "Save Changes" : "Create Workout"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWorkouts;
