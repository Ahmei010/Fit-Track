import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Filter,
  RotateCcw,
  Weight,
  Timer,
  Dumbbell,
  AlertTriangle,
  LineChart,
} from "lucide-react";

const ProgressList = () => {
  const navigate = useNavigate();

  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [filterDate, setFilterDate] = useState("");
  const [minWeight, setMinWeight] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Delete Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/progress", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProgressList(response.data.progress || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch progress");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProgress();
  }, []);

  // Filter & Sort Logic
  const filteredAndSortedProgress = useMemo(() => {
    let result = [...progressList];

    // 1. Date Filter
    if (filterDate) {
      result = result.filter((item) => {
        if (!item.date) return false;
        const itemDateStr = new Date(item.date).toISOString().split("T")[0];
        return itemDateStr === filterDate;
      });
    }

    // 2. Min Weight Filter
    if (minWeight !== "" && !isNaN(Number(minWeight))) {
      result = result.filter(
        (item) => item.weight !== undefined && Number(item.weight) >= Number(minWeight)
      );
    }

    // 3. Max Weight Filter
    if (maxWeight !== "" && !isNaN(Number(maxWeight))) {
      result = result.filter(
        (item) => item.weight !== undefined && Number(item.weight) <= Number(maxWeight)
      );
    }

    // 4. Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest": {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateB - dateA;
        }
        case "oldest": {
          const dateA = new Date(a.date || 0).getTime();
          const dateB = new Date(b.date || 0).getTime();
          return dateA - dateB;
        }
        case "weight_asc":
          return Number(a.weight || 0) - Number(b.weight || 0);
        case "weight_desc":
          return Number(b.weight || 0) - Number(a.weight || 0);
        case "runtime_desc":
          return Number(b.runTime || 0) - Number(a.runTime || 0);
        case "lifting_desc":
          return Number(b.liftingWeight || 0) - Number(a.liftingWeight || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [progressList, filterDate, minWeight, maxWeight, sortBy]);

  // Summary Metrics
  const latestWeight = useMemo(() => {
    if (progressList.length === 0) return null;
    const sorted = [...progressList].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0]?.weight ?? null;
  }, [progressList]);

  const maxLifting = useMemo(() => {
    if (progressList.length === 0) return 0;
    return Math.max(...progressList.map((item) => Number(item.liftingWeight || 0)));
  }, [progressList]);

  // Reset Filters
  const resetFilters = () => {
    setFilterDate("");
    setMinWeight("");
    setMaxWeight("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    filterDate !== "" || minWeight !== "" || maxWeight !== "" || sortBy !== "newest";

  // Confirm Delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/progress/${deleteTarget._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProgressList((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      toast.success("Progress record deleted successfully");
      setDeleteTarget(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete progress");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6 text-white animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            PERFORMANCE TIMELINE
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Progress Log
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Track body measurements, weight evolution, and lifting achievements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/progress/charts"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-sm font-semibold transition"
          >
            <LineChart size={16} className="text-orange-400" />
            <span>View Charts</span>
          </Link>

          <Link
            to="/progress/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition duration-300 shadow-lg shadow-orange-500/20 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            <span>Add Progress</span>
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Logged Entries */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Logged Entries</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {filteredAndSortedProgress.length}
              </span>
              <span className="text-xs font-medium text-gray-500">
                / {progressList.length} total
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Total recorded timeline</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 ml-4">
            <TrendingUp size={22} />
          </div>
        </div>

        {/* Card 2: Latest Weight */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Latest Weight</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-400 tracking-tight">
                {latestWeight !== null && latestWeight !== undefined && !isNaN(Number(latestWeight))
                  ? Number(latestWeight).toFixed(1)
                  : "—"}
              </span>
              {latestWeight !== null && latestWeight !== undefined && !isNaN(Number(latestWeight)) && (
                <span className="text-xs font-medium text-gray-500">kg</span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Most recent recorded weigh-in</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 ml-4">
            <Weight size={22} />
          </div>
        </div>

        {/* Card 3: Personal Best Lift */}
        <div className="h-full min-h-[110px] bg-[#111116] border border-white/10 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-white/20 transition-all">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 truncate">Personal Best Lift</p>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight">
                {maxLifting && !isNaN(Number(maxLifting)) && Number(maxLifting) > 0
                  ? Number(maxLifting).toFixed(1)
                  : "—"}
              </span>
              {maxLifting && !isNaN(Number(maxLifting)) && Number(maxLifting) > 0 && (
                <span className="text-xs font-medium text-gray-500">kg</span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">Max lifting resistance reached</p>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 ml-4">
            <Dumbbell size={22} />
          </div>
        </div>
      </div>

      {/* ── FILTER & SORT CONTROLS ── */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-orange-500" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Filter & Sort Progress
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Date Filter */}
          <div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-xs sm:text-sm transition cursor-pointer"
              title="Filter by exact date"
            />
          </div>

          {/* 2. Min Weight */}
          <div>
            <input
              type="number"
              placeholder="Min weight (kg)"
              value={minWeight}
              onChange={(e) => setMinWeight(e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-xs sm:text-sm transition"
            />
          </div>

          {/* 3. Max Weight */}
          <div>
            <input
              type="number"
              placeholder="Max weight (kg)"
              value={maxWeight}
              onChange={(e) => setMaxWeight(e.target.value)}
              min="0"
              step="0.1"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-xs sm:text-sm transition"
            />
          </div>

          {/* 4. Sorting */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-xs sm:text-sm transition cursor-pointer font-medium"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="weight_asc">Weight: Low to High</option>
              <option value="weight_desc">Weight: High to Low</option>
              <option value="runtime_desc">Run Time: High to Low</option>
              <option value="lifting_desc">Lifting: Heavy to Light</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── PROGRESS TABLE CARD ── */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-4 px-5">Date</th>
                <th className="py-4 px-5">Weight</th>
                <th className="py-4 px-5">Chest</th>
                <th className="py-4 px-5">Waist</th>
                <th className="py-4 px-5">Hips</th>
                <th className="py-4 px-5">Arms</th>
                <th className="py-4 px-5">Thighs</th>
                <th className="py-4 px-5">Run Time</th>
                <th className="py-4 px-5">Lifting</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span>Loading progress entries...</span>
                  </td>
                </tr>
              ) : filteredAndSortedProgress.length > 0 ? (
                filteredAndSortedProgress.map((item) => (
                  <tr key={item._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-5 font-bold text-white whitespace-nowrap">
                      {formatDate(item.date)}
                    </td>
                    <td className="py-4 px-5 font-extrabold text-orange-400">
                      {item.weight !== undefined ? `${item.weight} kg` : "—"}
                    </td>
                    <td className="py-4 px-5 text-gray-300 text-xs">
                      {item.chest !== undefined ? `${item.chest} cm` : "—"}
                    </td>
                    <td className="py-4 px-5 text-gray-300 text-xs">
                      {item.waist !== undefined ? `${item.waist} cm` : "—"}
                    </td>
                    <td className="py-4 px-5 text-gray-300 text-xs">
                      {item.hips !== undefined ? `${item.hips} cm` : "—"}
                    </td>
                    <td className="py-4 px-5 text-gray-300 text-xs">
                      {item.arms !== undefined ? `${item.arms} cm` : "—"}
                    </td>
                    <td className="py-4 px-5 text-gray-300 text-xs">
                      {item.thighs !== undefined ? `${item.thighs} cm` : "—"}
                    </td>
                    <td className="py-4 px-5 text-blue-400 font-semibold text-xs whitespace-nowrap">
                      {item.runTime !== undefined ? `${item.runTime} min` : "—"}
                    </td>
                    <td className="py-4 px-5 text-emerald-400 font-semibold text-xs whitespace-nowrap">
                      {item.liftingWeight !== undefined ? `${item.liftingWeight} kg` : "—"}
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/progress/edit/${item._id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 text-gray-300 hover:text-orange-400 border border-white/10 hover:border-orange-500/30 text-xs font-semibold transition"
                          title="Edit progress log"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition"
                          title="Delete progress log"
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
                    <TrendingUp size={40} className="mx-auto mb-3 text-gray-600" />
                    <p className="font-bold text-gray-300 text-base">
                      {hasActiveFilters
                        ? "No progress records match your filters"
                        : "No progress records found"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      {hasActiveFilters
                        ? "Try adjusting your date or weight filters."
                        : "Log your weight and body measurements to start visualizing your fitness transformation."}
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
                        to="/progress/add"
                        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition"
                      >
                        <Plus size={14} />
                        <span>Log First Entry</span>
                      </Link>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── DELETE PROGRESS MODAL (Replaces browser window.confirm) ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-md bg-[#16161d] border border-red-500/30 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Progress Entry</h3>
                <p className="text-xs text-gray-400">Confirm permanent deletion</p>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Are you sure you want to delete the progress record from{" "}
              <span className="font-bold text-white">
                {formatDate(deleteTarget.date)}
              </span>{" "}
              ({deleteTarget.weight ? `${deleteTarget.weight} kg` : "measurements"})? This action cannot be reversed.
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
                {deleteLoading ? "Deleting..." : "Delete Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressList;