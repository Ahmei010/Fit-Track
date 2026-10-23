import React from "react";
import { ShieldCheck, Menu } from "lucide-react";

const AdminHeader = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const toggleSidebar = () => {
    window.dispatchEvent(new Event("fittrack_toggle_admin_sidebar"));
  };

  return (
    <header className="fixed left-0 lg:left-64 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#080808]/95 px-5 sm:px-8 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition"
          aria-label="Toggle admin sidebar"
        >
          <Menu size={22} />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-orange-500">
            Control center
          </p>
          <h2 className="mt-0.5 text-base sm:text-lg font-bold text-white">
            Admin Dashboard
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-white">{user.name || "Admin"}</p>
          <p className="text-xs capitalize text-gray-500">{user.role || "admin"}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400">
          <ShieldCheck size={20} />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
