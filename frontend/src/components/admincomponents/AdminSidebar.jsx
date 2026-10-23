import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Dumbbell,
  Apple,
  Home,
  LogOut,
  ShieldCheck,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

const AdminSidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const active = (path) => location.pathname === path;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleToggle = () => {
      setMobileOpen((prev) => !prev);
    };

    window.addEventListener("fittrack_toggle_admin_sidebar", handleToggle);
    return () => window.removeEventListener("fittrack_toggle_admin_sidebar", handleToggle);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("fittrack_auth_change"));
    navigate("/login");
  };

  const navItems = [
    { path: "/admin-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/users", icon: Users, label: "Users" },
    { path: "/admin/feedback", icon: MessageSquare, label: "Feedback & Support" },
    { path: "/admin/workouts", icon: Dumbbell, label: "Workouts" },
    { path: "/admin/nutrition", icon: Apple, label: "Nutrition" },
  ];

  return (
    <>
      
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#080808] p-5 text-white transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0 shadow-2xl shadow-black" : "-translate-x-full lg:translate-x-0"
        }`}
      >
       
        <div className="mb-7 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="FitTrack" className="h-10 w-10 rounded-lg object-contain" />
            <div>
              <div className="text-xl font-extrabold tracking-wide">
                Fit<span className="text-orange-500">Track</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-orange-400">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
            aria-label="Close admin navigation"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-gray-500">
          Control Center
        </p>

        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = active(path);
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-500/15 text-orange-400 border border-orange-500/30 font-semibold shadow-sm"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} className={isActive ? "text-orange-400" : "text-gray-400"} />
                <span>{label}</span>
              </Link>
            );
          })}

          <div className="my-2 border-t border-white/5" />

          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition"
          >
            <Home size={18} />
            <span>View Website</span>
          </Link>
        </nav>

        {/* Footer Profile & Logout */}
        <div className="mt-auto">
          <div className="mb-3 rounded-xl border border-orange-500/20 bg-orange-500/5 p-3.5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
              <ShieldCheck size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Administrator</p>
              <p className="text-[10px] text-gray-400">Super Admin Access</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
