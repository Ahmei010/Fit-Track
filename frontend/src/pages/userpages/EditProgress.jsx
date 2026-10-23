import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, ArrowLeft, Scale, Ruler, Activity, Edit } from "lucide-react";

const EditProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [progress, setProgress] = useState({
    date: "",
    weight: "",
    chest: "",
    waist: "",
    hips: "",
    arms: "",
    thighs: "",
    runTime: "",
    liftingWeight: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const getSingleProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`http://localhost:5000/progress/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.progress;

        setProgress({
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
          weight: data.weight ?? "",
          chest: data.chest ?? "",
          waist: data.waist ?? "",
          hips: data.hips ?? "",
          arms: data.arms ?? "",
          thighs: data.thighs ?? "",
          runTime: data.runTime ?? "",
          liftingWeight: data.liftingWeight ?? "",
        });
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load progress record");
      } finally {
        setLoading(false);
      }
    };

    getSingleProgress();
  }, [id]);

  const handleChange = (e) => {
    setProgress({
      ...progress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!progress.date) {
      toast.error("Log date is required");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const payload = {
        date: progress.date,
        weight: progress.weight === "" ? undefined : Number(progress.weight),
        chest: progress.chest === "" ? undefined : Number(progress.chest),
        waist: progress.waist === "" ? undefined : Number(progress.waist),
        hips: progress.hips === "" ? undefined : Number(progress.hips),
        arms: progress.arms === "" ? undefined : Number(progress.arms),
        thighs: progress.thighs === "" ? undefined : Number(progress.thighs),
        runTime: progress.runTime === "" ? undefined : Number(progress.runTime),
        liftingWeight:
          progress.liftingWeight === "" ? undefined : Number(progress.liftingWeight),
      };

      await axios.put(`http://localhost:5000/progress/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Progress record updated successfully!");
      navigate("/progress");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update progress");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-semibold text-sm">Loading progress details...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-2 sm:py-6 text-white animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            RECORD EDITOR
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Edit Progress
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Modify measurements and performance metrics for this entry
          </p>
        </div>

        <Link
          to="/progress"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-sm font-semibold transition"
        >
          <ArrowLeft size={16} />
          <span>Back to Progress</span>
        </Link>
      </div>

      {/* Main Form */}
      <div className="bg-[#111116] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* 1. Date & Weight */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Scale size={17} className="text-orange-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Core Metrics
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Record Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={progress.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white focus:border-orange-500 outline-none text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Body Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={progress.weight}
                  onChange={handleChange}
                  placeholder="e.g. 75.5"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm transition font-semibold"
                />
              </div>
            </div>
          </div>

          {/* 2. Body Measurements */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Ruler size={17} className="text-orange-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Body Tape Measurements (cm)
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Chest (cm)
                </label>
                <input
                  type="number"
                  name="chest"
                  value={progress.chest}
                  onChange={handleChange}
                  placeholder="e.g. 102"
                  min="0"
                  step="0.1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Waist (cm)
                </label>
                <input
                  type="number"
                  name="waist"
                  value={progress.waist}
                  onChange={handleChange}
                  placeholder="e.g. 84"
                  min="0"
                  step="0.1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Hips (cm)
                </label>
                <input
                  type="number"
                  name="hips"
                  value={progress.hips}
                  onChange={handleChange}
                  placeholder="e.g. 96"
                  min="0"
                  step="0.1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Arms (cm)
                </label>
                <input
                  type="number"
                  name="arms"
                  value={progress.arms}
                  onChange={handleChange}
                  placeholder="e.g. 38"
                  min="0"
                  step="0.1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  Thighs (cm)
                </label>
                <input
                  type="number"
                  name="thighs"
                  value={progress.thighs}
                  onChange={handleChange}
                  placeholder="e.g. 58"
                  min="0"
                  step="0.1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>
            </div>
          </div>

          {/* 3. Performance Metrics */}
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <Activity size={17} className="text-orange-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                Athletic Performance
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Run Time (minutes)
                </label>
                <input
                  type="number"
                  name="runTime"
                  value={progress.runTime}
                  onChange={handleChange}
                  placeholder="e.g. 28.5"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Max Lifting Weight (kg)
                </label>
                <input
                  type="number"
                  name="liftingWeight"
                  value={progress.liftingWeight}
                  onChange={handleChange}
                  placeholder="e.g. 110"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-xl bg-[#16161d] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 outline-none text-sm font-semibold transition"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate("/progress")}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition duration-300 shadow-lg shadow-orange-500/25 disabled:opacity-50 hover:-translate-y-0.5"
            >
              <Save size={18} />
              <span>{saving ? "Updating..." : "Update Progress Entry"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProgress;