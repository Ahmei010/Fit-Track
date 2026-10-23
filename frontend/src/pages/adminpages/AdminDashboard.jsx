import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  Clock,
  CheckCircle2,
  RefreshCw,
  Dumbbell,
  Apple,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Could not load admin statistics. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const stats = data?.stats;

  const mainCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      note: "Registered regular users",
      link: "/admin/users",
    },
    {
      label: "Total Feedback",
      value: stats?.totalFeedback ?? 0,
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      note: "All support queries & feedback",
      link: "/admin/feedback",
    },
    {
      label: "Pending Feedback",
      value: stats?.pendingFeedback ?? 0,
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      note: "Awaiting administrator review",
      link: "/admin/feedback?status=Pending",
    },
    {
      label: "Resolved Feedback",
      value: stats?.resolvedFeedback ?? 0,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      note: "Completed tickets",
      link: "/admin/feedback?status=Resolved",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d12] p-5 sm:p-8 text-gray-100">
      <div className="mx-auto max-w-7xl">
       
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[.25em] text-orange-400">
                FitTrack Administration
              </p>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl text-white">
              System Overview & Analytics
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage platform users, support inquiries, workout database, and nutrition plans.
            </p>
          </div>

          <button
            onClick={loadStats}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition active:scale-95"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300 flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4 Main Stat Cards Requested by User */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {mainCards.map(({ label, value, icon: Icon, color, bg, note, link }) => (
            <Link
              to={link}
              key={label}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#14141a] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-orange-500/10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {label}
                  </p>
                  <p className="mt-3 text-3xl font-extrabold text-white">
                    {loading ? "..." : value}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${bg} ${color}`}>
                  <Icon size={22} />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                <span className="text-xs text-gray-400">{note}</span>
                <ArrowRight
                  size={14}
                  className="text-gray-500 group-hover:text-orange-400 group-hover:translate-x-1 transition"
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Secondary Modules Stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Link
            to="/admin/workouts"
            className="rounded-2xl border border-white/10 bg-[#14141a] p-5 flex items-center justify-between hover:border-orange-500/40 transition"
          >
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Workouts</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {loading ? "..." : stats?.totalWorkouts ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-orange-500/15 p-3 text-orange-400">
              <Dumbbell size={22} />
            </div>
          </Link>

          <Link
            to="/admin/nutrition"
            className="rounded-2xl border border-white/10 bg-[#14141a] p-5 flex items-center justify-between hover:border-orange-500/40 transition"
          >
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Nutrition Entries</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {loading ? "..." : stats?.totalNutrition ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-400">
              <Apple size={22} />
            </div>
          </Link>

          <Link
            to="/admin/feedback"
            className="rounded-2xl border border-white/10 bg-[#14141a] p-5 flex items-center justify-between hover:border-orange-500/40 transition"
          >
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">In Progress Tickets</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {loading ? "..." : stats?.inProgressFeedback ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
              <Clock size={22} />
            </div>
          </Link>
        </div>

        {/* 2-Column Tables: Recent Users & Recent Feedback */}
        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-2">
          {/* Recent Users */}
          <div className="rounded-2xl border border-white/10 bg-[#14141a] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-500/10 p-2 text-orange-400">
                  <Users size={18} />
                </div>
                <h2 className="text-base font-bold text-white">Recent Users</h2>
              </div>
              <Link
                to="/admin/users"
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition"
              >
                View All Users →
              </Link>
            </div>

            {loading ? (
              <p className="py-6 text-center text-sm text-gray-400">Loading users...</p>
            ) : !data?.recentUsers?.length ? (
              <p className="py-6 text-center text-sm text-gray-500">No registered users found.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {data.recentUsers.map((u) => (
                  <div key={u._id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/20 text-orange-300 font-bold text-xs uppercase">
                        {u.name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{u.name}</p>
                        <p className="text-xs text-gray-400">@{u.username} • {u.email}</p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${u.role === "admin"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-blue-500/20 text-blue-400"
                        }`}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Feedback */}
          <div className="rounded-2xl border border-white/10 bg-[#14141a] p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-orange-500/10 p-2 text-orange-400">
                  <MessageSquare size={18} />
                </div>
                <h2 className="text-base font-bold text-white">Recent Support Tickets</h2>
              </div>
              <Link
                to="/admin/feedback"
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 transition"
              >
                Manage Tickets →
              </Link>
            </div>

            {loading ? (
              <p className="py-6 text-center text-sm text-gray-400">Loading feedback...</p>
            ) : !data?.recentFeedback?.length ? (
              <p className="py-6 text-center text-sm text-gray-500">No support inquiries yet.</p>
            ) : (
              <div className="divide-y divide-white/5">
                {data.recentFeedback.map((f) => (
                  <div key={f._id} className="flex items-start justify-between py-3 gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{f.subject}</p>
                      <p className="text-xs text-gray-400 truncate">
                        By {f.name} ({f.email})
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${f.status === "Resolved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : f.status === "In Progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-amber-500/20 text-amber-400"
                        }`}
                    >
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;