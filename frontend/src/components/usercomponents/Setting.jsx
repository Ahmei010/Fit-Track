
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Bell,
  Shield,
  Moon,
  Lock,
  LogOut,
  ChevronRight,
  Check,
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
 

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userName = user?.name || "User";
  const userEmail = user?.email || "No email";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-full text-white animate-fade-in-up pb-10">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Settings
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your FitTrack account and preferences
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl space-y-6">

        {/* Account Section */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">

          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-lg font-semibold">
              Account
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your personal account information
            </p>
          </div>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition"
          >

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <User className="text-orange-500" size={21} />
              </div>

              <div className="text-left">
                <p className="font-medium">
                  Profile
                </p>

                <p className="text-sm text-gray-500">
                  {userName} • {userEmail}
                </p>
              </div>

            </div>

            <ChevronRight
              size={20}
              className="text-gray-500"
            />

          </button>

        </div>

        {/* Notifications */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">

          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-lg font-semibold">
              Notifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Control how FitTrack keeps you updated
            </p>
          </div>

          {/* Push Notifications */}
          <div className="px-6 py-5 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Bell className="text-orange-500" size={21} />
              </div>

              <div>
                <p className="font-medium">
                  Push Notifications
                </p>

                <p className="text-sm text-gray-500">
                  Receive workout and progress reminders
                </p>
              </div>

            </div>

            {/* Toggle */}
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition relative ${
                notifications
                  ? "bg-orange-500"
                  : "bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  notifications
                    ? "left-7"
                    : "left-1"
                }`}
              />
            </button>

          </div>

          {/* Email Notifications */}
          <div className="px-6 py-5 border-t border-white/10 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Bell className="text-orange-500" size={21} />
              </div>

              <div>
                <p className="font-medium">
                  Email Notifications
                </p>

                <p className="text-sm text-gray-500">
                  Receive updates and fitness tips by email
                </p>
              </div>

            </div>

            <button
              onClick={() =>
                setEmailNotifications(!emailNotifications)
              }
              className={`w-12 h-6 rounded-full transition relative ${
                emailNotifications
                  ? "bg-orange-500"
                  : "bg-gray-700"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                  emailNotifications
                    ? "left-7"
                    : "left-1"
                }`}
              />
            </button>

          </div>

        </div>

      

        {/* Security */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">

          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-lg font-semibold">
              Security & Privacy
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Keep your account secure
            </p>
          </div>

          {/* Change Password */}
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition"
          >

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Lock className="text-orange-500" size={21} />
              </div>

              <div className="text-left">
                <p className="font-medium">
                  Change Password
                </p>

                <p className="text-sm text-gray-500">
                  Update your account password
                </p>
              </div>

            </div>

            <ChevronRight
              size={20}
              className="text-gray-500"
            />

          </button>

          {/* Privacy */}
          <button
            className="w-full px-6 py-5 border-t border-white/10 flex items-center justify-between hover:bg-white/5 transition"
          >

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Shield className="text-orange-500" size={21} />
              </div>

              <div className="text-left">
                <p className="font-medium">
                  Privacy
                </p>

                <p className="text-sm text-gray-500">
                  Manage your privacy preferences
                </p>
              </div>

            </div>

            <ChevronRight
              size={20}
              className="text-gray-500"
            />

          </button>

        </div>

        {/* Logout */}
        <div className="bg-[#111111] border border-red-500/20 rounded-2xl p-6">

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition font-medium"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Settings;
