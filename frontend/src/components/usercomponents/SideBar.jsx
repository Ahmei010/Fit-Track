import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Dumbbell,
  Apple,
  ChevronDown,
  Plus,
  List,
  BarChart3,
  LayoutDashboard,
  TrendingUp,
  LineChart,
  MessageSquare,
  Bell,
  FileText,
  UtensilsCrossed,
  X,
  Layers,
} from "lucide-react";
import logo from "../../assets/logo.png";

const SideBar = () => {
  const [showWorkout, setShowWorkout] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Auto-open parent dropdown if active route is a child
  useEffect(() => {
    if (["/add-category", "/add-workout"].includes(location.pathname)) {
      setShowWorkout(true);
    }
    if (["/add-nutrition", "/nutrition", "/meal-types"].includes(location.pathname)) {
      setShowNutrition(true);
    }
    if (["/progress", "/progress/charts", "/progress/add"].includes(location.pathname)) {
      setShowProgress(true);
    }
    // Close mobile drawer on route change
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Listen for mobile sidebar toggle event from Header
  useEffect(() => {
    const handleToggle = () => {
      setIsMobileOpen((prev) => !prev);
    };

    window.addEventListener("fittrack_toggle_sidebar", handleToggle);
    return () => window.removeEventListener("fittrack_toggle_sidebar", handleToggle);
  }, []);

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/75 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#080808] border-r border-[#222226] text-white z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* ── Fixed Brand & Logo Header (Does NOT scroll) ── */}
        <div className="shrink-0 px-5 pt-5 pb-3 border-b border-white/5 bg-[#080808]">
          <div className="flex items-center justify-between px-1">
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <img src={logo} alt="FitTrack" className="w-10 h-10 object-contain rounded-lg group-hover:scale-105 transition" />
              <div className="text-xl font-extrabold tracking-wide text-white">
                Fit<span className="text-orange-500">Track</span>
              </div>
            </Link>

            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <p className="px-1 mt-4 text-[10px] font-bold uppercase tracking-[.2em] text-gray-500">
            User Workspace
          </p>
        </div>

        {/* ── Independently Scrollable Navigation Menu (Dark Scrollbar) ── */}
        <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-1.5 custom-scrollbar">
          {/* Dashboard */}
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive("/dashboard")
                ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 font-semibold shadow-sm"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} className={isActive("/dashboard") ? "text-orange-400" : ""} />
            <span>Dashboard</span>
          </Link>

            {/* ── Workout Dropdown ── */}
            <div>
              <button
                onClick={() => setShowWorkout(!showWorkout)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
              >
                <span className="flex items-center gap-3">
                  <Dumbbell size={18} className={showWorkout ? "text-orange-400" : ""} />
                  <span>Workouts</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    showWorkout ? "rotate-180 text-orange-400" : ""
                  }`}
                />
              </button>

              {showWorkout && (
                <div className="ml-5 mt-1 pl-3 border-l border-white/10 flex flex-col gap-1 animate-fade-in-up">
                  <Link
                    to="/add-category"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive("/add-category")
                        ? "text-orange-400 bg-orange-500/10 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Layers size={14} />
                    <span>Workout Categories</span>
                  </Link>

                  <Link
                    to="/add-workout"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive("/add-workout")
                        ? "text-orange-400 bg-orange-500/10 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <List size={14} />
                    <span>Workout Exercises</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Nutrition Dropdown (Enhanced with Dynamic Meal Types) ── */}
            <div>
              <button
                onClick={() => setShowNutrition(!showNutrition)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
              >
                <span className="flex items-center gap-3">
                  <Apple size={18} className={showNutrition ? "text-orange-400" : ""} />
                  <span>Nutrition</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    showNutrition ? "rotate-180 text-orange-400" : ""
                  }`}
                />
              </button>

              {showNutrition && (
                <div className="ml-5 mt-1 pl-3 border-l border-white/10 flex flex-col gap-1 animate-fade-in-up">
                  <Link
                    to="/meal-types"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive("/meal-types")
                        ? "text-orange-400 bg-orange-500/10 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <UtensilsCrossed size={14} />
                    <span>Manage Meal Types</span>
                  </Link>

                  <Link
                    to="/add-nutrition"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive("/add-nutrition")
                        ? "text-orange-400 bg-orange-500/10 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Plus size={14} />
                    <span>Add Meal</span>
                  </Link>

                  <Link
                    to="/nutrition"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive("/nutrition")
                        ? "text-orange-400 bg-orange-500/10 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <List size={14} />
                    <span>Nutrition Records</span>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Progress Dropdown ── */}
            <div>
              <button
                onClick={() => setShowProgress(!showProgress)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
              >
                <span className="flex items-center gap-3">
                  <BarChart3 size={18} className={showProgress ? "text-orange-400" : ""} />
                  <span>Progress</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    showProgress ? "rotate-180 text-orange-400" : ""
                  }`}
                />
              </button>

              {showProgress && (
                <div className="ml-5 mt-1 pl-3 border-l border-white/10 flex flex-col gap-1 animate-fade-in-up">
                  <Link
                    to="/progress"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive("/progress")
                        ? "text-orange-400 bg-orange-500/10 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <TrendingUp size={14} />
                    <span>Progress Logs</span>
                  </Link>

                  <Link
                    to="/progress/charts"
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition ${
                      isActive("/progress/charts")
                        ? "text-orange-400 bg-orange-500/10 font-semibold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <LineChart size={14} />
                    <span>Progress Charts</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/reminders"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive("/reminders")
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 font-semibold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Bell size={18} />
              <span>Reminders</span>
            </Link>

            <Link
              to="/analytics"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive("/analytics")
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 font-semibold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <TrendingUp size={18} />
              <span>Analytics</span>
            </Link>

            <Link
              to="/reports"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive("/reports")
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 font-semibold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FileText size={18} />
              <span>Reports</span>
            </Link>

            <Link
              to="/support"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive("/support")
                  ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 font-semibold"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <MessageSquare size={18} />
              <span>Support</span>
            </Link>
        </div>

        {/* ── Fixed Bottom Section (Public Website Shortcut) ── */}
        <div className="shrink-0 p-4 border-t border-white/10 bg-[#080808]">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition border border-transparent hover:border-white/10"
          >
            <span>← Public Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SideBar;