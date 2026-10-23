import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import MealTypeList from "../../components/usercomponents/MealTypeList";
import { Plus, UtensilsCrossed, X, FolderPlus } from "lucide-react";

const AddMealType = () => {
  const [mealTypeName, setMealTypeName] = useState("");
  const [description, setDescription] = useState("");
  const [mealTypes, setMealTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const getMealTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/meal-type");
      setMealTypes(res.data.mealTypes || []);
    } catch (error) {
      toast.error("Failed to load meal types");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    getMealTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mealTypeName.trim()) {
      toast.error("Please enter a meal type name");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/meal-type/create", {
        mealTypeName: mealTypeName.trim(),
        description: description.trim(),
      });

      toast.success("Meal type created successfully");
      setMealTypeName("");
      setDescription("");
      await getMealTypes();
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add meal type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-100px)] text-white">
      {/* ── Meal Type List View ── */}
      {!showForm && (
        <MealTypeList
          mealTypes={mealTypes}
          setMealTypes={setMealTypes}
          onAdd={() => setShowForm(true)}
        />
      )}

      {/* ── Add Meal Type Form ── */}
      {showForm && (
        <div className="max-w-xl mx-auto py-4 animate-fade-in-up">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <FolderPlus size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Add Meal Type</h1>
                <p className="text-xs text-gray-400">
                  Create a new category for your nutrition and meal plans
                </p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <UtensilsCrossed size={16} className="text-orange-500" />
                <span className="text-sm font-semibold text-white">
                  New Meal Type Details
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setMealTypeName("");
                  setDescription("");
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Meal Type Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Breakfast, Pre-Workout, Post-Workout, Snack"
                  value={mealTypeName}
                  onChange={(e) => setMealTypeName(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Nutrient-dense morning meals to jumpstart metabolism"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm resize-none transition"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition shadow-lg shadow-orange-500/25 disabled:opacity-50"
                >
                  <Plus size={16} />
                  <span>{loading ? "Adding..." : "Create Meal Type"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setMealTypeName("");
                    setDescription("");
                  }}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          <p className="text-xs text-gray-500 text-center mt-5">
            💡 Meal types will immediately appear in your nutrition logging dropdown and filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddMealType;
