import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Users,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Calendar,
  Activity,
  AlertTriangle,
} from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals state
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", username: "", email: "", role: "user" });
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openViewProfile = async (u) => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/users/${u._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setViewUser(res.data);
    } catch (err) {
      setViewUser({ user: u, activity: { progressRecords: 0, feedbacks: 0 } });
    }
  };

  const openEditModal = (u) => {
    setEditUser(u);
    setEditForm({
      name: u.name || "",
      username: u.username || "",
      email: u.email || "",
      role: u.role || "user",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/users/${editUser._id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "User updated successfully");
      setEditUser(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!deleteUser) return;
    setActionLoading(true);
    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/users/${deleteUser._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "User deleted successfully");
      setDeleteUser(null);
      loadUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#0d0d12] p-5 sm:p-8 text-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.25em] text-orange-400">
              Users Management
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
              Platform Accounts ({users.length})
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              View user details, update account roles, and manage permissions.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#14141a] py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#14141a] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Username</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelf = u._id === currentUser._id;
                    return (
                      <tr key={u._id} className="hover:bg-white/[0.02] transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 font-bold uppercase">
                              {u.name?.charAt(0) || "U"}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white truncate">{u.name}</p>
                              {isSelf && (
                                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                                  (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-300">@{u.username}</td>
                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              u.role === "admin"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-400 text-xs">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Profile */}
                            <button
                              onClick={() => openViewProfile(u)}
                              title="View Profile"
                              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
                            >
                              <Eye size={17} />
                            </button>
                            {/* Edit User */}
                            <button
                              onClick={() => openEditModal(u)}
                              title="Edit User"
                              className="rounded-lg p-2 text-blue-400 hover:bg-blue-500/10 transition"
                            >
                              <Pencil size={17} />
                            </button>
                            {/* Delete User */}
                            {!isSelf && (
                              <button
                                onClick={() => setDeleteUser(u)}
                                title="Delete User"
                                className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition"
                              >
                                <Trash2 size={17} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1. VIEW USER PROFILE MODAL */}
        {viewUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#14141a] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <UserIcon size={20} className="text-orange-400" /> User Profile
                </h3>
                <button
                  onClick={() => setViewUser(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20 text-orange-400 text-3xl font-extrabold uppercase border-2 border-orange-500/40">
                  {viewUser.user?.name?.charAt(0) || "U"}
                </div>
                <h2 className="mt-3 text-xl font-bold text-white">{viewUser.user?.name}</h2>
                <p className="text-sm text-gray-400">@{viewUser.user?.username}</p>
                <div className="mt-2">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                      viewUser.user?.role === "admin"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    Role: {viewUser.user?.role}
                  </span>
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-white/[0.03] p-4 text-sm border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Mail size={15} /> Email
                  </span>
                  <span className="font-medium text-white">{viewUser.user?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Calendar size={15} /> Joined Date
                  </span>
                  <span className="font-medium text-white">
                    {viewUser.user?.createdAt
                      ? new Date(viewUser.user.createdAt).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Activity size={15} /> Progress Logs
                  </span>
                  <span className="font-bold text-orange-400">
                    {viewUser.activity?.progressRecords ?? 0} records
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setViewUser(null)}
                  className="rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. EDIT USER MODAL */}
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#14141a] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Pencil size={18} className="text-orange-400" /> Edit User Account
                </h3>
                <button
                  onClick={() => setEditUser(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-300">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Username</label>
                  <input
                    type="text"
                    required
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300">Account Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0d0d12] px-4 py-2.5 text-sm text-white focus:border-orange-500 focus:outline-none"
                  >
                    <option value="user">Regular User (user)</option>
                    <option value="admin">Administrator (admin)</option>
                  </select>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="rounded-xl bg-gray-800 px-5 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 disabled:opacity-50"
                  >
                    {actionLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 3. DELETE USER MODAL */}
        {deleteUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#14141a] p-6 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400">
                <div className="rounded-xl bg-red-500/10 p-3">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Delete Account</h3>
                  <p className="text-xs text-gray-400">This action cannot be undone.</p>
                </div>
              </div>

              <p className="mt-4 text-sm text-gray-300">
                Are you sure you want to permanently delete{" "}
                <span className="font-bold text-white">"{deleteUser.name}"</span> (
                <span className="text-gray-400">@{deleteUser.username}</span>)? All associated
                progress and nutrition logs will be purged.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteUser(null)}
                  className="rounded-xl bg-gray-800 px-4 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmit}
                  disabled={actionLoading}
                  className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-600/20"
                >
                  {actionLoading ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
