import React, { useState, useEffect } from "react";
import { ChevronDown, LogOut, UserCircle, Settings, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const syncUser = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(stored);
    } catch {
      setUser({});
    }
  };

  useEffect(() => {
    syncUser();

    const handleAuthChange = () => {
      syncUser();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("fittrack_auth_change", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("fittrack_auth_change", handleAuthChange);
    };
  }, []);

  const userName = user.name || user.username || "Member";
  const rawPicture = user.profilePicture || "";
  const profilePicture = rawPicture
    ? rawPicture.startsWith("http")
      ? rawPicture
      : `http://localhost:5000${rawPicture}`
    : "";

  const firstLetter = userName.charAt(0).toUpperCase();

  const handleViewProfile = () => {
    setOpen(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setOpen(false);
    navigate("/setting");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("fittrack_auth_change"));
    setOpen(false);
    navigate("/login");
  };

  const toggleMobileSidebar = () => {
    window.dispatchEvent(new Event("fittrack_toggle_sidebar"));
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-20 bg-[#080808]/95 backdrop-blur-md border-b border-orange-500/20 px-4 sm:px-7">
      <div className="h-full flex items-center justify-between">
        {/* Mobile Sidebar Hamburger Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Toggle user navigation"
          >
            <Menu size={22} />
          </button>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[.2em] text-orange-500">
              User Portal
            </p>
            <h2 className="text-base font-bold text-white">FitTrack Dashboard</h2>
          </div>
        </div>

        {/* Profile Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition"
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/50 shadow-md"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center border-2 border-orange-500/50 shadow-md">
                <span className="text-white font-bold text-sm">{firstLetter}</span>
              </div>
            )}

            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-white leading-tight">
                {userName}
              </p>
              <p className="text-xs text-orange-400 font-medium">FitTrack Member</p>
            </div>

            <ChevronDown
              size={17}
              className={`text-gray-400 transition-transform duration-200 ${
                open ? "rotate-180 text-orange-400" : ""
              }`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-14 w-60 bg-[#111116] border border-orange-500/25 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-50 animate-fade-in-up">
              {/* User Info Header */}
              <div className="px-4 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={userName}
                      className="w-11 h-11 rounded-full object-cover border border-orange-500/50"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold">{firstLetter}</span>
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate text-sm">
                      {userName}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user.email || "Member Account"}
                    </p>
                  </div>
                </div>
              </div>

              {/* View Profile */}
              <button
                onClick={handleViewProfile}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 transition"
              >
                <UserCircle size={18} />
                <span>View Profile</span>
              </button>

              {/* Settings */}
              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-orange-400 transition"
              >
                <Settings size={18} />
                <span>Settings</span>
              </button>

              {/* Logout */}
              <div className="border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/15 transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
