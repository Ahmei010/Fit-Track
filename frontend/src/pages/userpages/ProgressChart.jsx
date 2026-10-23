import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft, TrendingUp, Scale, Ruler, Activity, Plus } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a24] border border-white/20 p-3 rounded-xl shadow-xl text-xs space-y-1">
        <p className="font-bold text-orange-400 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ProgressChart = () => {
  const [progressList, setProgressList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get("http://localhost:5000/progress", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.progress || [];

        const formattedData = [...data]
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((item) => ({
            ...item,
            formattedDate: new Date(item.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            }),
          }));

        setProgressList(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="font-semibold text-sm">Loading charts & analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
            VISUAL TRENDS
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Progress Analytics
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Track your fitness journey, weight curve, and lifting progression over time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/progress"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-sm font-semibold transition"
          >
            <ArrowLeft size={16} />
            <span>View Table Log</span>
          </Link>
          <Link
            to="/progress/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition duration-300 shadow-lg shadow-orange-500/20 hover:-translate-y-0.5"
          >
            <Plus size={18} />
            <span>Add Entry</span>
          </Link>
        </div>
      </div>

      {progressList.length === 0 ? (
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-12 text-center text-gray-500">
          <TrendingUp size={44} className="mx-auto mb-3 text-gray-600" />
          <h2 className="text-lg font-bold text-white mb-1">No Progress Data Recorded Yet</h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            Log your first weight and body measurement entry to generate real-time graphs and trendlines.
          </p>
          <Link
            to="/progress/add"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition shadow-lg shadow-orange-500/20"
          >
            <Plus size={16} />
            <span>Log First Entry</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. WEIGHT PROGRESS CHART */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400">
                <Scale size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Weight Curve (kg)</h2>
                <p className="text-xs text-gray-400">Chronological bodyweight timeline</p>
              </div>
            </div>

            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressList} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22222d" />
                  <XAxis dataKey="formattedDate" stroke="#777" tick={{ fill: "#999", fontSize: 11 }} />
                  <YAxis stroke="#777" tick={{ fill: "#999", fontSize: 11 }} domain={["auto", "auto"]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight (kg)"
                    stroke="#ff5a00"
                    strokeWidth={3}
                    dot={{ fill: "#ff5a00", r: 4 }}
                    activeDot={{ r: 6, fill: "#ffffff" }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 2. BODY MEASUREMENTS CHART */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Ruler size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Body Circumferences (cm)</h2>
                <p className="text-xs text-gray-400">Chest, Waist, Hips, Arms, and Thighs</p>
              </div>
            </div>

            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressList} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22222d" />
                  <XAxis dataKey="formattedDate" stroke="#777" tick={{ fill: "#999", fontSize: 11 }} />
                  <YAxis stroke="#777" tick={{ fill: "#999", fontSize: 11 }} domain={["auto", "auto"]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Line type="monotone" dataKey="chest" name="Chest" stroke="#ff5a00" strokeWidth={2} connectNulls dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="waist" name="Waist" stroke="#3b82f6" strokeWidth={2} connectNulls dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="hips" name="Hips" stroke="#10b981" strokeWidth={2} connectNulls dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="arms" name="Arms" stroke="#eab308" strokeWidth={2} connectNulls dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="thighs" name="Thighs" stroke="#a855f7" strokeWidth={2} connectNulls dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. PERFORMANCE CHART */}
          <div className="bg-[#111116] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Athletic Benchmarks</h2>
                <p className="text-xs text-gray-400">Cardio run time & peak lifting resistance</p>
              </div>
            </div>

            <div className="w-full h-72 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressList} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#22222d" />
                  <XAxis dataKey="formattedDate" stroke="#777" tick={{ fill: "#999", fontSize: 11 }} />
                  <YAxis stroke="#777" tick={{ fill: "#999", fontSize: 11 }} domain={["auto", "auto"]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Line
                    type="monotone"
                    dataKey="liftingWeight"
                    name="Max Lift (kg)"
                    stroke="#ff5a00"
                    strokeWidth={3}
                    dot={{ fill: "#ff5a00", r: 4 }}
                    connectNulls
                  />
                  <Line
                    type="monotone"
                    dataKey="runTime"
                    name="Run Time (min)"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 3 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;