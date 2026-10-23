import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  ChevronDown,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Helper to read current user from localStorage safely
  const readUserFromStorage = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      } else {
        setCurrentUser({});
      }
    } catch {
      setCurrentUser(null);
    }
  };

  // Validate authentication against backend
  const validateAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentUser(null);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.user) {
        setCurrentUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      // If token is invalid or expired, clear and restore guest status
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setCurrentUser(null);
      }
    }
  };

  useEffect(() => {
    readUserFromStorage();
    validateAuth();

    // Listen for cross-tab or in-page storage changes (e.g. login, logout, profile update)
    const handleStorageChange = () => {
      readUserFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("fittrack_auth_change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("fittrack_auth_change", handleStorageChange);
    };
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    window.dispatchEvent(new Event("fittrack_auth_change"));
    toast.success("Logged out successfully");
    navigate("/");
  };

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token && !!currentUser;
  const isAdmin = currentUser?.role === "admin";

  const getAvatarUrl = () => {
    if (!currentUser?.profilePicture) return null;
    if (currentUser.profilePicture.startsWith("http")) {
      return currentUser.profilePicture;
    }
    return `http://localhost:5000${currentUser.profilePicture}`;
  };

  const avatarUrl = getAvatarUrl();
  const userName = currentUser?.name || currentUser?.username || "Member";
  const userInitial = userName.charAt(0).toUpperCase();

  const navLinks = [
    { to: "/home", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/blog", label: "Blog" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact Us" },
  ];

  const isActiveLink = (path) => {
    if (path === "/home") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* ================= FIXED NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full bg-[#08080c]/95 backdrop-blur-md z-[9999] border-b border-white/10 shadow-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between">
            {/* LOGO */}
            <Link
              to="/home"
              onClick={closeMenu}
              className="flex items-center gap-2.5 sm:gap-3 group"
            >
              <img
                src={logo}
                alt="FitTrack Logo"
                className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Fit<span className="text-orange-500">Track</span>
              </div>
            </Link>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const active = isActiveLink(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`font-semibold text-sm transition-colors duration-200 ${
                      active
                        ? "text-orange-500"
                        : "text-gray-300 hover:text-orange-400"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* AUTH NAVIGATION STATE */}
              {isLoggedIn ? (
                /* LOGGED IN: Profile Avatar & Dropdown */
                <div className="relative ml-2" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40 transition duration-200"
                    aria-label="User profile menu"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={userName}
                        className="w-9 h-9 rounded-full object-cover border border-orange-500/60"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {userInitial}
                      </div>
                    )}
                    <div className="text-left max-w-[110px] truncate">
                      <p className="text-xs font-semibold text-white truncate leading-tight">
                        {userName}
                      </p>
                      <p className="text-[10px] text-orange-400 font-medium">
                        {isAdmin ? "Admin" : "Member"}
                      </p>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-orange-400" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#111116] border border-white/15 shadow-2xl shadow-black/80 p-2 z-50 animate-fade-in-up">
                      {/* Header with User Info */}
                      <div className="p-3 border-b border-white/10 mb-1">
                        <div className="flex items-center gap-3">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={userName}
                              className="w-10 h-10 rounded-full object-cover border border-orange-500/50"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-base">
                              {userInitial}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-white truncate">
                              {userName}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {currentUser?.email || "FitTrack Account"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Navigation Links */}
                      <div className="space-y-0.5">
                        <Link
                          to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-orange-500/15 hover:border-orange-500/30 transition"
                        >
                          {isAdmin ? (
                            <ShieldCheck size={17} className="text-orange-400" />
                          ) : (
                            <LayoutDashboard size={17} className="text-orange-400" />
                          )}
                          <span>{isAdmin ? "Admin Dashboard" : "User Dashboard"}</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-orange-500/15 transition"
                        >
                          <User size={17} className="text-orange-400" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/setting"
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-orange-500/15 transition"
                        >
                          <Settings size={17} className="text-orange-400" />
                          <span>Settings</span>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="mt-1 pt-1 border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/15 hover:text-red-300 transition"
                        >
                          <LogOut size={17} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* GUEST: Sign In & Sign Up */
                <div className="flex items-center gap-3 ml-2">
                  <Link
                    to="/login"
                    className="text-white text-sm font-bold hover:text-orange-400 px-3 py-2 transition duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-5 py-2.5 rounded-xl font-bold transition duration-300 shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* ================= MOBILE HAMBURGER BUTTON ================= */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none transition"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* ================= MOBILE DRAWER MENU ================= */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 border-t border-white/10 pt-4 pb-3 animate-fade-in-up">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const active = isActiveLink(link.to);
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={closeMenu}
                      className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${
                        active
                          ? "bg-orange-500/15 text-orange-400 font-bold"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* MOBILE AUTH LINKS */}
                <div className="pt-3 mt-2 border-t border-white/10">
                  {isLoggedIn ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={userName}
                            className="w-10 h-10 rounded-full object-cover border border-orange-500/50"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                            {userInitial}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white truncate">
                            {userName}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {currentUser?.email || "Signed In"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-200 hover:bg-orange-500/10 hover:text-orange-400 transition"
                      >
                        <LayoutDashboard size={17} className="text-orange-400" />
                        <span>{isAdmin ? "Admin Dashboard" : "User Dashboard"}</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-200 hover:bg-orange-500/10 hover:text-orange-400 transition"
                      >
                        <User size={17} className="text-orange-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/setting"
                        onClick={closeMenu}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-200 hover:bg-orange-500/10 hover:text-orange-400 transition"
                      >
                        <Settings size={17} className="text-orange-400" />
                        <span>Settings</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
                      >
                        <LogOut size={17} />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        to="/login"
                        onClick={closeMenu}
                        className="block text-center border border-white/20 text-white px-5 py-2.5 rounded-xl font-bold hover:border-orange-500 hover:text-orange-500 transition"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMenu}
                        className="block text-center bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Top spacer for fixed navbar */}
      <div className="h-[74px]"></div>
    </>
  );
};

export default Navbar;