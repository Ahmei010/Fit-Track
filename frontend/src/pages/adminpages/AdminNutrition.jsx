import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Apple,
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
  Flame,
  Utensils,
} from "lucide-react";

const AdminNutrition = () => {
  const [nutrition, setNutrition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    mealType: "Breakfast",
    foodItem: "",
    quantity: "1 serving",
    calories: 250,
    protein: 20,
    carbs: 30,
    fats: 5,
    date: new Date().toISOString().split("T")[0],
  });
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");

  const loadNutrition = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/admin/nutrition", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNutrition(res.data.nutrition || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load nutrition");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNutrition();
  }, []);

  const openAddModal = () => {
    setEditId(null);
    setFormData({
      mealType: "Breakfast",
      foodItem: "",
      quantity: "1 serving",
      calories: 250,
      protein: 20,
      carbs: 30,
      fats: 5,
      date: new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditId(item._id);
    setFormData({
      mealType: item.mealType || "Breakfast",
      foodItem: item.foodItem || "",
      quantity: item.quantity || "",
      calories: item.calories || 0,
      protein: item.protein || 0,
      carbs: item.carbs || 0,
      fats: item.fats || 0,
      date: item.date || new Date().toISOString().split("T")[0],
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        // Edit Nutrition
        const res = await axios.put(
          `http://localhost:5000/admin/nutrition/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message || "Nutrition item updated");
      } else {
        // Add Nutrition
        const res = await axios.post(
          "http://localhost:5000/admin/nutrition",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(res.data.message || "Nutrition item added");
      }
      setIsModalOpen(false);
      loadNutrition();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save nutrition item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this nutrition item?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/admin/nutrition/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Item deleted");
      loadNutrition();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    }
  };

  const filteredNutrition = nutrition.filter((n) => {
    const q = search.toLowerCase();
    return (
      n.foodItem?.toLowerCase().includes(q) ||
      n.mealType?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0d0d12] p-5 sm:p-8 text-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-orange-400">
              Dietary Database
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
              Nutrition & Diet Entries ({nutrition.length})
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              View food items, monitor caloric intake, and manage nutrition templates.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
              <input
                type="text"
                placeholder="Search food item..."
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
              Add Nutrition
            </button>
          </div>
        </div>

        {/* Nutrition Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#14141a] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-6 py-4">Food Item</th>
                  <th className="px-6 py-4">Meal Type</th>
                  <th className="px-6 py-4">Portion</th>
                  <th className="px-6 py-4">Calories</th>
                  <th className="px-6 py-4">Macros (P / C / F)</th>
                  <th className="px-6 py-4">Logged Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-400">
                      Loading nutrition records...
                    </td>
                  </tr>
                ) : filteredNutrition.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">
                      No nutrition records found. Click "Add Nutrition" to create an entry.
                    </td>
                  </tr>
                ) : (
                  filteredNutrition.map((item) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                            <Apple size={18} />
                          </div>
                          <p className="font-semibold text-white">{item.foodItem}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-orange-400 border border-white/10">
                          {item.mealType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.quantity}</td>
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-1.5 pt-5">
                        <Flame size={15} className="text-orange-500 shrink-0" />
                        {item.calories} kcal
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-300">
                        <span className="font-semibold text-blue-400">{item.protein}g</span> P •{" "}
                        <span className="font-semibold text-amber-400">{item.carbs}g</span> C •{" "}
                        <span className="font-semibold text-rose-400">{item.fats}g</span> F
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">{item.date || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            title="Edit Item"
                            className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10 transition"
                          >
                            <Pencil size={17} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            title="Delete Item"
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

        {/* ADD / EDIT NUTRITION MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#14141a] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Apple size={20} className="text-orange-400" />
                  {editId ? "Edit Nutrition Item" : "Add Nutrition Item"}
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
                    <label className="text-xs font-semibold text-gray-300">Food Item</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Oatmeal with Almonds"
                      value={formData.foodItem}
                      onChange={(e) => setFormData({ ...formData, foodItem: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Meal Type</label>
                    <select
                      value={formData.mealType}
                      onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snack">Snack</option>
                      <option value="Pre-Workout">Pre-Workout</option>
                      <option value="Post-Workout">Post-Workout</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Portion / Quantity</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1 bowl (100g)"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Total Calories (kcal)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.calories}
                      onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-300">Protein (g)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.protein}
                      onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Carbs (g)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.carbs}
                      onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300">Fats (g)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.fats}
                      onChange={(e) => setFormData({ ...formData, fats: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-3.5 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Date Logged</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    {submitting ? "Saving..." : editId ? "Save Changes" : "Create Item"}
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

export default AdminNutrition;
