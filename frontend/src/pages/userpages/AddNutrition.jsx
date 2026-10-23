import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Apple, Plus, ArrowLeft, UtensilsCrossed, Sparkles } from "lucide-react";

const AddNutrition = () => {
  const [nutrition, setNutrition] = useState({
    mealType: "",
    foodItem: "",
    quantity: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [mealTypes, setMealTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMealTypes, setFetchingMealTypes] = useState(true);

  const navigate = useNavigate();

  // Fetch dynamic meal types from MongoDB backend
  useEffect(() => {
    const fetchMealTypes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/meal-type");
        const list = res.data.mealTypes || [];
        setMealTypes(list);
        if (list.length > 0) {
          setNutrition((prev) => ({ ...prev, mealType: list[0].mealTypeName }));
        }
      } catch (error) {
        console.error("Failed to load meal types:", error);
        toast.error("Could not load dynamic meal types");
      } finally {
        setFetchingMealTypes(false);
      }
    };

    fetchMealTypes();
  }, []);

  const handleChange = (e) => {
    setNutrition({
      ...nutrition,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !nutrition.mealType ||
      !nutrition.foodItem.trim() ||
      !nutrition.quantity.trim() ||
      nutrition.calories === "" ||
      nutrition.protein === "" ||
      nutrition.carbs === "" ||
      nutrition.fats === "" ||
      !nutrition.date
    ) {
      toast.error("Please fill in all nutrition fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/nutrition/add", {
        mealType: nutrition.mealType,
        foodItem: nutrition.foodItem.trim(),
        quantity: nutrition.quantity.trim(),
        calories: Number(nutrition.calories),
        protein: Number(nutrition.protein),
        carbs: Number(nutrition.carbs),
        fats: Number(nutrition.fats),
        date: nutrition.date,
      });

      toast.success("Meal record logged successfully!");

      setNutrition({
        mealType: mealTypes.length > 0 ? mealTypes[0].mealTypeName : "",
        foodItem: "",
        quantity: "",
        calories: "",
        protein: "",
        carbs: "",
        fats: "",
        date: new Date().toISOString().split("T")[0],
      });

      navigate("/nutrition");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add nutrition record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-6 text-white animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            NUTRITION LOGGER
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Add Nutrition
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Log your daily meal, calories, and macronutrient intake
          </p>
        </div>

        <Link
          to="/nutrition"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-sm font-semibold transition"
        >
          <ArrowLeft size={16} />
          <span>View Nutrition List</span>
        </Link>
      </div>

      {/* Main Form Card */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Meal Type (Dynamic from DB) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                  Meal Type *
                </label>
                <Link
                  to="/meal-types"
                  className="text-xs font-semibold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1"
                >
                  <UtensilsCrossed size={12} />
                  <span>Manage Types</span>
                </Link>
              </div>

              {fetchingMealTypes ? (
                <div className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-gray-400 text-sm">
                  Loading meal types...
                </div>
              ) : mealTypes.length > 0 ? (
                <select
                  name="mealType"
                  value={nutrition.mealType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-sm transition cursor-pointer"
                >
                  {mealTypes.map((mt) => (
                    <option key={mt._id} value={mt.mealTypeName} className="bg-[#16161d] text-white">
                      {mt.mealTypeName}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  name="mealType"
                  value={nutrition.mealType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              )}
            </div>

            {/* Food Item */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Food Item *
              </label>
              <input
                type="text"
                name="foodItem"
                value={nutrition.foodItem}
                onChange={handleChange}
                placeholder="e.g. Oatmeal with Almonds & Banana"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm transition"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Portion / Quantity *
              </label>
              <input
                type="text"
                name="quantity"
                value={nutrition.quantity}
                onChange={handleChange}
                placeholder="e.g. 1 bowl (250g) or 2 scoops"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm transition"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Log Date *
              </label>
              <input
                type="date"
                name="date"
                value={nutrition.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-sm transition"
              />
            </div>
          </div>

          {/* Macronutrients Section */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-orange-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Energy & Macros
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-orange-400 mb-2">
                  Calories (kcal) *
                </label>
                <input
                  type="number"
                  name="calories"
                  value={nutrition.calories}
                  onChange={handleChange}
                  placeholder="350"
                  min="0"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-2">
                  Protein (g) *
                </label>
                <input
                  type="number"
                  name="protein"
                  value={nutrition.protein}
                  onChange={handleChange}
                  placeholder="25"
                  min="0"
                  step="0.1"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  Carbs (g) *
                </label>
                <input
                  type="number"
                  name="carbs"
                  value={nutrition.carbs}
                  onChange={handleChange}
                  placeholder="45"
                  min="0"
                  step="0.1"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Fats (g) *
                </label>
                <input
                  type="number"
                  name="fats"
                  value={nutrition.fats}
                  onChange={handleChange}
                  placeholder="10"
                  min="0"
                  step="0.1"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate("/nutrition")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition duration-300 shadow-lg shadow-orange-500/25 disabled:opacity-50 hover:-translate-y-0.5"
            >
              <Plus size={18} />
              <span>{loading ? "Recording..." : "Save Nutrition Log"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNutrition;