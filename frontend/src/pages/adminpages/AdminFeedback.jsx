import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  X,
  User,
  Mail,
  Tag,
  Calendar,
} from "lucide-react";

const AdminFeedback = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status") || "All";

  const [feedback, setFeedback] = useState([]);
  const [counts, setCounts] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const token = localStorage.getItem("token");

  const loadFeedback = async (status = selectedStatus) => {
    setLoading(true);
    try {
      const url =
        status && status !== "All"
          ? `http://localhost:5000/admin/feedback?status=${encodeURIComponent(status)}`
          : "http://localhost:5000/admin/feedback";

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback(res.data.feedback || []);
      if (res.data.counts) setCounts(res.data.counts);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load feedback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback(selectedStatus);
  }, [selectedStatus]);

  const handleTabChange = (status) => {
    setSelectedStatus(status);
    if (status === "All") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", status);
    }
    setSearchParams(searchParams);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/feedback/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data.message || "Status updated");
      loadFeedback(selectedStatus);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/admin/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data.message || "Feedback deleted");
      if (activeMessage?._id === id) setActiveMessage(null);
      loadFeedback(selectedStatus);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete feedback");
    }
  };

  const tabs = [
    { label: "All Feedback", value: "All", count: counts.total },
    { label: "Pending", value: "Pending", count: counts.pending, color: "text-amber-400" },
    { label: "In Progress", value: "In Progress", count: counts.inProgress, color: "text-blue-400" },
    { label: "Resolved", value: "Resolved", count: counts.resolved, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d12] p-5 sm:p-8 text-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 border-b border-white/10 pb-6">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-orange-400">
            Customer Support
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
            Feedback & Inquiries
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Review user feedback, technical issues, and resolve support requests.
          </p>

          {/* Status Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const active = selectedStatus === tab.value;
              return (
                <button
                  key={tab.value}
                  onClick={() => handleTabChange(tab.value)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    active
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                      : "bg-[#14141a] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      active ? "bg-white/20 text-white" : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback Table / List */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#14141a] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-wider text-gray-400">
                <tr>
                  <th className="px-6 py-4">Sender</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-400">
                      Loading inquiries...
                    </td>
                  </tr>
                ) : feedback.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500">
                      No feedback entries in "{selectedStatus}" category.
                    </td>
                  </tr>
                ) : (
                  feedback.map((item) => (
                    <tr key={item._id} className="hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-xs text-gray-400">{item.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-medium text-gray-300 border border-white/5">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-white max-w-xs truncate">{item.subject}</p>
                        <p className="text-xs text-gray-400 max-w-xs truncate">{item.message}</p>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={item.status}
                          disabled={updatingId === item._id}
                          onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold focus:outline-none transition ${
                            item.status === "Resolved"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                              : item.status === "In Progress"
                              ? "border-blue-500/40 bg-blue-500/10 text-blue-300"
                              : "border-amber-500/40 bg-amber-500/10 text-amber-300"
                          }`}
                        >
                          <option value="Pending" className="bg-[#14141a] text-white">
                            Pending
                          </option>
                          <option value="In Progress" className="bg-[#14141a] text-white">
                            In Progress
                          </option>
                          <option value="Resolved" className="bg-[#14141a] text-white">
                            Resolved
                          </option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setActiveMessage(item)}
                            title="View Full Message"
                            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            onClick={() => handleDeleteFeedback(item._id)}
                            title="Delete Feedback"
                            className="rounded-lg p-2 text-red-400 hover:bg-red-500/10 transition"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* VIEW MESSAGE MODAL */}
        {activeMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#14141a] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="rounded-md bg-orange-500/20 px-2 py-0.5 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                    {activeMessage.type}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-white">{activeMessage.subject}</h3>
                </div>
                <button
                  onClick={() => setActiveMessage(null)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 space-y-2 text-xs text-gray-400 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <User size={14} className="text-orange-400" />
                  <span className="font-semibold text-white">{activeMessage.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span>{activeMessage.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span>
                    Received:{" "}
                    {activeMessage.createdAt
                      ? new Date(activeMessage.createdAt).toLocaleString()
                      : "—"}
                  </span>
                </div>
              </div>

              <div className="py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Message Content:
                </p>
                <div className="mt-2 rounded-xl bg-white/[0.03] p-4 text-sm text-gray-200 leading-relaxed border border-white/5 whitespace-pre-wrap">
                  {activeMessage.message}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Status:</span>
                  <select
                    value={activeMessage.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      await handleStatusUpdate(activeMessage._id, newStatus);
                      setActiveMessage({ ...activeMessage, status: newStatus });
                    }}
                    className="rounded-lg border border-white/10 bg-[#0d0d12] px-3 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <button
                  onClick={() => setActiveMessage(null)}
                  className="rounded-xl bg-gray-800 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
