import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Utensils,
  Calendar,
  Flame,
  X,
  Save,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const NutritionList = () => {
  const [nutrition, setNutrition] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchFood, setSearchFood] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [maxCalories, setMaxCalories] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Edit Modal State
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({
    mealType: "",
    foodItem: "",
    quantity: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    date: "",
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch Nutrition Records
  const getNutrition = async () => {
    try {
      const res = await axios.get("http://localhost:5000/nutrition");
      setNutrition(res.data.nutrition || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch nutrition records");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Dynamic Meal Types
  const getMealTypes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/meal-type");
      setMealTypes(res.data.mealTypes || []);
    } catch (error) {
      console.error("Meal type load error:", error);
    }
  };

  useEffect(() => {
    getNutrition();
    getMealTypes();
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedNutrition = useMemo(() => {
    let result = [...nutrition];

    // 1. Filter by Food Item Search
    if (searchFood.trim()) {
      const query = searchFood.trim().toLowerCase();
      result = result.filter((item) =>
        (item.foodItem || "").toLowerCase().includes(query)
      );
    }

    // 2. Filter by Meal Type
    if (selectedMealType !== "all") {
      result = result.filter(
        (item) =>
          (item.mealType || "").toLowerCase() === selectedMealType.toLowerCase()
      );
    }

    // 3. Filter by Date
    if (selectedDate) {
      result = result.filter((item) => item.date === selectedDate);
    }

    // 4. Filter by Max Calories
    if (maxCalories !== "" && !isNaN(Number(maxCalories))) {
      result = result.filter((item) => Number(item.calories || 0) <= Number(maxCalories));
    }

    // 5. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const dateA = new Date(a.date || a.createdAt || 0).getTime();
          const dateB = new Date(b.date || b.createdAt || 0).getTime();
          return dateB - dateA;
        }
        case "oldest": {
          const dateA = new Date(a.date || a.createdAt || 0).getTime();
          const dateB = new Date(b.date || b.createdAt || 0).getTime();
          return dateA - dateB;
        }
        case "cal_asc":
          return Number(a.calories || 0) - Number(b.calories || 0);
        case "cal_desc":
          return Number(b.calories || 0) - Number(a.calories || 0);
        case "food_asc":
          return (a.foodItem || "").localeCompare(b.foodItem || "");
        case "food_desc":
          return (b.foodItem || "").localeCompare(a.foodItem || "");
        default:
          return 0;
      }
    });

    return result;
  }, [nutrition, searchFood, selectedMealType, selectedDate, maxCalories, sortBy]);

  // Summary Metrics of filtered data
  const totalFilteredCalories = useMemo(() => {
    return filteredAndSortedNutrition.reduce(
      (sum, item) => sum + Number(item.calories || 0),
      0
    );
  }, [filteredAndSortedNutrition]);

  const totalFilteredProtein = useMemo(() => {
    return filteredAndSortedNutrition.reduce(
      (sum, item) => sum + Number(item.protein || 0),
      0
    );
  }, [filteredAndSortedNutrition]);

  // Reset Filters
  const resetFilters = () => {
    setSearchFood("");
    setSelectedMealType("all");
    setSelectedDate("");
    setMaxCalories("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchFood !== "" ||
    selectedMealType !== "all" ||
    selectedDate !== "" ||
    maxCalories !== "" ||
    sortBy !== "newest";

  // Open Edit Modal
  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({
      mealType: item.mealType || "",
      foodItem: item.foodItem || "",
      quantity: item.quantity || "",
      calories: item.calories || "",
      protein: item.protein || "",
      carbs: item.carbs || "",
      fats: item.fats || "",
      date: item.date || "",
    });
  };

  const closeEdit = () => {
    setEditItem(null);
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (
      !editForm.mealType ||
      !editForm.foodItem.trim() ||
      !editForm.quantity.trim() ||
      editForm.calories === "" ||
      !editForm.date
    ) {
      toast.error("Please fill in all required nutrition fields");
      return;
    }

    try {
      setEditLoading(true);
      const res = await axios.put(
        `http://localhost:5000/nutrition/${editItem._id}`,
        {
          mealType: editForm.mealType,
          foodItem: editForm.foodItem.trim(),
          quantity: editForm.quantity.trim(),
          calories: Number(editForm.calories),
          protein: Number(editForm.protein || 0),
          carbs: Number(editForm.carbs || 0),
          fats: Number(editForm.fats || 0),
          date: editForm.date,
        }
      );

      toast.success("Nutrition record updated successfully");
      setNutrition((prev) =>
        prev.map((item) => (item._id === editItem._id ? res.data.nutrition : item))
      );
      closeEdit();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update nutrition record");
    } finally {
      setEditLoading(false);
    }
  };

  // Submit Delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      await axios.delete(`http://localhost:5000/nutrition/${deleteTarget._id}`);
      toast.success("Nutrition record removed");
      setNutrition((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete nutrition record");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-white animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            DAILY CONSUMPTION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Nutrition Records
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Track, filter, and review all your logged meals and calories
          </p>
        </div>

        <Link
          to="/add-nutrition"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition duration-300 shadow-lg shadow-orange-500/20 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span>Add New Meal</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Filtered Entries */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Filtered Entries</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {filteredAndSortedNutrition.length}
              </span>
              <span className="text-xs font-medium text-gray-500">
                / {nutrition.length} total
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Active filter results</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 ml-4">
            <Utensils size={22} />
          </div>
        </div>

        {/* Card 2: Total Calories */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Total Calories</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-400 tracking-tight">
                {totalFilteredCalories.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-gray-500">kcal</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Total logged calorie intake</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 ml-4">
            <Flame size={22} />
          </div>
        </div>

        {/* Card 3: Total Protein */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Total Protein</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight">
                {totalFilteredProtein.toFixed(1)}
              </span>
              <span className="text-xs font-medium text-gray-500">g</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Macro nutrient balance</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 ml-4">
            <Sparkles size={22} />
          </div>
        </div>
      </div>

      {/* ── FILTER & SORT CONTROLS ── */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-orange-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Filter & Sort Nutrition
            </h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 text-xs font-bold transition"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* 1. Food Item Search */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search food item..."
              value={searchFood}
              onChange={(e) => setSearchFood(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-xs sm:text-sm transition"
            />
          </div>

          {/* 2. Meal Type Filter */}
          <div>
            <select
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-xs sm:text-sm transition cursor-pointer"
            >
              <option value="all">All Meal Types</option>
              {mealTypes.map((mt) => (
                <option key={mt._id} value={mt.mealTypeName}>
                  {mt.mealTypeName}
                </option>
              ))}
              {/* Fallbacks if empty */}
              {mealTypes.length === 0 && (
                <>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </>
              )}
            </select>
          </div>

          {/* 3. Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-xs sm:text-sm transition cursor-pointer"
              title="Filter by specific date"
            />
          </div>

          {/* 4. Calories Filter */}
          <div>
            <input
              type="number"
              placeholder="Max calories (e.g. 500)"
              value={maxCalories}
              onChange={(e) => setMaxCalories(e.target.value)}
              min="0"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-xs sm:text-sm transition"
            />
          </div>

          {/* 5. Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-xs sm:text-sm transition cursor-pointer font-medium"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="cal_desc">Calories: High to Low</option>
              <option value="cal_asc">Calories: Low to High</option>
              <option value="food_asc">Food Item: A to Z</option>
              <option value="food_desc">Food Item: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── NUTRITION RECORDS TABLE ── */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-5">Meal</th>
                <th className="py-4 px-5">Food Item</th>
                <th className="py-4 px-5">Portion</th>
                <th className="py-4 px-5">Calories</th>
                <th className="py-4 px-5">Protein</th>
                <th className="py-4 px-5">Carbs</th>
                <th className="py-4 px-5">Fats</th>
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span>Loading nutrition records...</span>
                  </td>
                </tr>
              ) : filteredAndSortedNutrition.length > 0 ? (
                filteredAndSortedNutrition.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                        {item.mealType}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-white max-w-[200px] truncate">
                      {item.foodItem}
                    </td>
                    <td className="py-4 px-5 text-gray-300 text-xs">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-5 font-extrabold text-orange-400">
                      {item.calories} <span className="text-[10px] text-gray-500 font-normal">kcal</span>
                    </td>
                    <td className="py-4 px-5 text-blue-400 font-semibold text-xs">
                      {item.protein}g
                    </td>
                    <td className="py-4 px-5 text-emerald-400 font-semibold text-xs">
                      {item.carbs}g
                    </td>
                    <td className="py-4 px-5 text-amber-400 font-semibold text-xs">
                      {item.fats}g
                    </td>
                    <td className="py-4 px-5 text-gray-400 text-xs whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400 border border-white/10 hover:border-orange-500/30 text-xs font-semibold transition"
                          title="Edit nutrition log"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition"
                          title="Delete nutrition log"
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
                  <td colSpan="9" className="py-16 text-center text-gray-500">
                    <Utensils size={40} className="mx-auto mb-3 text-gray-600" />
                    <p className="font-bold text-gray-300 text-base">
                      {hasActiveFilters
                        ? "No nutrition records match your filters"
                        : "No nutrition records found"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      {hasActiveFilters
                        ? "Try clearing your search term, adjusting the calorie range, or resetting filters."
                        : "Start recording your daily food, portions, and macronutrients."}
                    </p>
                    {hasActiveFilters ? (
                      <button
                        onClick={resetFilters}
                        className="mt-4 px-4 py-2 rounded-xl bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 text-xs font-bold transition"
                      >
                        Reset All Filters
                      </button>
                    ) : (
                      <Link
                        to="/add-nutrition"
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition"
                      >
                        <Plus size={14} />
                        <span>Log First Meal</span>
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── EDIT NUTRITION MODAL (Replaces cramped row edit) ── */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-lg bg-[#16161d] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Edit size={16} />
                </div>
                <h3 className="text-lg font-bold text-white">Edit Nutrition Record</h3>
              </div>
              <button
                onClick={closeEdit}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Meal Type *
                  </label>
                  <select
                    name="mealType"
                    value={editForm.mealType}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                  >
                    {mealTypes.map((mt) => (
                      <option key={mt._id} value={mt.mealTypeName}>
                        {mt.mealTypeName}
                      </option>
                    ))}
                    {mealTypes.length === 0 && (
                      <>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snacks">Snacks</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Food Item *
                </label>
                <input
                  type="text"
                  name="foodItem"
                  value={editForm.foodItem}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Portion / Quantity *
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={editForm.quantity}
                  onChange={handleEditChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e0e13] border border-white/10 text-white focus:border-orange-500 outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-orange-400 mb-1">
                    Calories *
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={editForm.calories}
                    onChange={handleEditChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0e13] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-blue-400 mb-1">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    name="protein"
                    value={editForm.protein}
                    onChange={handleEditChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0e13] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 mb-1">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    name="carbs"
                    value={editForm.carbs}
                    onChange={handleEditChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0e13] border border-white/10 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-amber-400 mb-1">
                    Fats (g)
                  </label>
                  <input
                    type="number"
                    name="fats"
                    value={editForm.fats}
                    onChange={handleEditChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e0e13] border border-white/10 text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition shadow-lg shadow-orange-500/20 disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>{editLoading ? "Updating..." : "Update Record"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE NUTRITION MODAL (Replaces browser confirm) ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-md bg-[#16161d] border border-red-500/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Nutrition Entry</h3>
                <p className="text-xs text-gray-400">Confirm record deletion</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Are you sure you want to delete the log for{" "}
              <span className="font-bold text-white">
                "{deleteTarget.foodItem}" ({deleteTarget.calories} kcal)
              </span>
              ? This action cannot be undone.
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
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition shadow-md shadow-red-600/20 disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionList;