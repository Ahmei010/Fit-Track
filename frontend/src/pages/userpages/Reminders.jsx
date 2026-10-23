import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Bell,
  Plus,
  Trash2,
  Pencil,
  X,
  Dumbbell,
  Apple,
  Target,
  BellRing,
} from "lucide-react";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/reminders";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(
      localStorage.getItem("fittrack_notifications") === "true"
    );

  const [formData, setFormData] = useState({
    title: "",
    type: "Workout",
    date: "",
    time: "",
    repeat: "Once",
  });

  const token = localStorage.getItem("token");

  // =====================================
  // FETCH REMINDERS
  // =====================================

  const fetchReminders = async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReminders(response.data);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load reminders"
      );
    }
  };

  // =====================================
  // NOTIFICATION TOGGLE
  // =====================================

  const toggleNotifications = async () => {
    // ================================
    // TURN OFF
    // ================================
    if (notificationsEnabled) {
      setNotificationsEnabled(false);

      localStorage.setItem(
        "fittrack_notifications",
        "false"
      );

      toast.info("Notifications turned off");

      return;
    }

    // ================================
    // TURN ON
    // ================================

    if (!("Notification" in window)) {
      toast.error(
        "Your browser does not support notifications"
      );

      return;
    }

    // If browser permission is already denied
    if (Notification.permission === "denied") {
      toast.error(
        "Notifications are blocked. Please allow them from browser settings."
      );

      return;
    }

    let permission = Notification.permission;

    if (permission !== "granted") {
      permission =
        await Notification.requestPermission();
    }

    if (permission === "granted") {
      setNotificationsEnabled(true);

      localStorage.setItem(
        "fittrack_notifications",
        "true"
      );

      toast.success("Notifications enabled successfully");

      new Notification("FitTrack", {
        body: "Notifications are now enabled!",
      });
    } else {
      setNotificationsEnabled(false);

      localStorage.setItem(
        "fittrack_notifications",
        "false"
      );

      toast.error("Notification permission denied");
    }
  };

  // =====================================
  // CHECK NOTIFICATION STATUS
  // =====================================

  useEffect(() => {
    if (!("Notification" in window)) {
      setNotificationsEnabled(false);
      return;
    }

    const savedStatus =
      localStorage.getItem(
        "fittrack_notifications"
      );

    if (
      Notification.permission === "granted" &&
      savedStatus === "true"
    ) {
      setNotificationsEnabled(true);
    } else {
      setNotificationsEnabled(false);
    }
  }, []);

  // =====================================
  // FETCH DATA
  // =====================================

  useEffect(() => {
    fetchReminders();
  }, []);

  // =====================================
  // FORM CHANGE
  // =====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================
  // ADD / UPDATE
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `${API_URL}/${editingId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Reminder updated successfully"
        );
      } else {
        await axios.post(API_URL, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(
          "Reminder created successfully"
        );
      }

      closeForm();

      fetchReminders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // =====================================
  // OPEN EDIT
  // =====================================

  const editReminder = (reminder) => {
    setEditingId(reminder._id);

    setFormData({
      title: reminder.title,
      type: reminder.type,
      date: reminder.date,
      time: reminder.time,
      repeat: reminder.repeat,
    });

    setShowForm(true);
  };

  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  // =====================================
  // DELETE
  // =====================================

  const confirmDeleteReminder = async () => {
    if (!deleteModal.id) return;

    try {
      await axios.delete(`${API_URL}/${deleteModal.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Reminder deleted");
      setDeleteModal({ open: false, id: null });
      fetchReminders();
    } catch (error) {
      toast.error("Failed to delete reminder");
    }
  };

  const deleteReminder = (id) => {
    setDeleteModal({ open: true, id });
  };

  // =====================================
  // TOGGLE REMINDER
  // =====================================

  const toggleReminder = async (id) => {
    try {
      await axios.patch(
        `${API_URL}/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReminders();
    } catch (error) {
      toast.error("Failed to update reminder");
    }
  };

  // =====================================
  // OPEN ADD FORM
  // =====================================

  const openAddForm = () => {
    setEditingId(null);

    setFormData({
      title: "",
      type: "Workout",
      date: "",
      time: "",
      repeat: "Once",
    });

    setShowForm(true);
  };

  // =====================================
  // CLOSE FORM
  // =====================================

  const closeForm = () => {
    setShowForm(false);

    setEditingId(null);

    setFormData({
      title: "",
      type: "Workout",
      date: "",
      time: "",
      repeat: "Once",
    });
  };

  // =====================================
  // REMINDER ICON
  // =====================================

  const getIcon = (type) => {
    if (type === "Workout") {
      return <Dumbbell size={22} />;
    }

    if (type === "Meal") {
      return <Apple size={22} />;
    }

    return <Target size={22} />;
  };

  // =====================================
  // NOTIFICATION CHECKER
  // =====================================

  useEffect(() => {
    const checkReminders = () => {
      if (!notificationsEnabled) {
        return;
      }

      if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
      ) {
        return;
      }

      const now = new Date();

      const currentDate =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0");

      const currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");

      reminders.forEach((reminder) => {
        if (!reminder.isActive) return;

        if (reminder.date !== currentDate) return;

        if (reminder.time !== currentTime) return;

        const notificationKey =
          `fittrack_${reminder._id}_${currentDate}_${currentTime}`;

        if (
          localStorage.getItem(notificationKey)
        ) {
          return;
        }

        new Notification(
          "FitTrack Reminder 🔔",
          {
            body: `${reminder.title} - ${reminder.type}`,
            icon: "/favicon.ico",
          }
        );

        localStorage.setItem(
          notificationKey,
          "true"
        );
      });
    };

    const interval = setInterval(
      checkReminders,
      30000
    );

    checkReminders();

    return () => clearInterval(interval);
  }, [reminders, notificationsEnabled]);

  return (
    <div className="w-full text-white animate-fade-in-up pb-10">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-extrabold text-white">
            Alerts & Reminders
          </h1>

          <p className="text-gray-400 mt-2">
            Set reminders for your workouts,
            meals and fitness goals.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">

          {/* NOTIFICATION BUTTON */}

          <button
            onClick={toggleNotifications}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg border font-semibold transition duration-300 ${
              notificationsEnabled
                ? "border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                : "border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00] hover:bg-[#ff6b00]/20"
            }`}
          >
            <BellRing size={19} />

            {notificationsEnabled
              ? "Notifications ON"
              : "Enable Notifications"}
          </button>

          {/* ADD REMINDER */}

          <button
            onClick={openAddForm}
            className="flex items-center gap-2 bg-[#ff6b00] hover:bg-orange-600 px-5 py-3 rounded-lg font-semibold transition"
          >
            <Plus size={20} />

            Add Reminder
          </button>

        </div>
      </div>

      {/* ================= REMINDERS ================= */}

      {reminders.length === 0 ? (

        <div className="bg-[#15151c] border border-gray-800 rounded-xl p-12 text-center">

          <Bell
            size={55}
            className="mx-auto text-[#ff6b00] mb-4"
          />

          <h2 className="text-xl font-semibold">
            No reminders found
          </h2>

          <p className="text-gray-400 mt-2">
            Create your first reminder.
          </p>

        </div>

      ) : (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {reminders.map((reminder) => (

            <div
              key={reminder._id}
              className={`bg-[#15151c] border rounded-xl p-5 transition ${
                reminder.isActive
                  ? "border-gray-800 hover:border-[#ff6b00]"
                  : "border-gray-800 opacity-60"
              }`}
            >

              {/* TOP */}

              <div className="flex justify-between">

                <div className="flex gap-3">

                  <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#ff6b00]/10 text-[#ff6b00]">
                    {getIcon(reminder.type)}
                  </div>

                  <div>

                    <h3 className="font-semibold text-lg">
                      {reminder.title}
                    </h3>

                    <p className="text-[#ff6b00] text-sm">
                      {reminder.type}
                    </p>

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      editReminder(reminder)
                    }
                    className="text-gray-400 hover:text-[#ff6b00]"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      deleteReminder(reminder._id)
                    }
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>

              {/* DETAILS */}

              <div className="mt-5 space-y-2 text-gray-300 text-sm">

                <p>
                  📅 {reminder.date}
                </p>

                <p>
                  ⏰ {reminder.time}
                </p>

                <p>
                  🔁 {reminder.repeat}
                </p>

              </div>

              {/* ACTIVE */}

              <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-800">

                <span className="text-sm text-gray-400">
                  {reminder.isActive
                    ? "Active"
                    : "Disabled"}
                </span>

                <button
                  onClick={() =>
                    toggleReminder(reminder._id)
                  }
                  className={`w-12 h-6 rounded-full p-1 transition ${
                    reminder.isActive
                      ? "bg-[#ff6b00]"
                      : "bg-gray-700"
                  }`}
                >

                  <div
                    className={`w-4 h-4 bg-white rounded-full transition ${
                      reminder.isActive
                        ? "translate-x-6"
                        : "translate-x-0"
                    }`}
                  />

                </button>

              </div>

            </div>

          ))}

        </div>
      )}

      {/* ================= MODAL ================= */}

      {showForm && (

        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">

          <div className="bg-[#15151c] border border-gray-800 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">

            {/* MODAL HEADER */}

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-2xl font-bold">
                {editingId
                  ? "Update Reminder"
                  : "Add Reminder"}
              </h2>

              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* TITLE */}

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Reminder Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Morning Workout"
                  required
                  className="w-full bg-[#0d0d12] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#ff6b00]"
                />
              </div>

              {/* TYPE */}

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Reminder Type
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-[#0d0d12] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#ff6b00]"
                >
                  <option value="Workout">
                    Workout
                  </option>

                  <option value="Meal">
                    Meal
                  </option>

                  <option value="Fitness Goal">
                    Fitness Goal
                  </option>
                </select>
              </div>

              {/* DATE */}

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0d0d12] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#ff6b00]"
                />
              </div>

              {/* TIME */}

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0d0d12] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#ff6b00]"
                />
              </div>

              {/* REPEAT */}

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Repeat
                </label>

                <select
                  name="repeat"
                  value={formData.repeat}
                  onChange={handleChange}
                  className="w-full bg-[#0d0d12] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#ff6b00]"
                >
                  <option value="Once">
                    Once
                  </option>

                  <option value="Daily">
                    Daily
                  </option>

                  <option value="Weekly">
                    Weekly
                  </option>
                </select>
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className="w-full bg-[#ff6b00] hover:bg-orange-600 py-3 rounded-lg font-semibold transition"
              >
                {editingId
                  ? "Update Reminder"
                  : "Save Reminder"}
              </button>

            </form>

          </div>

        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-[#111116] border border-white/10 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Reminder</h3>
            <p className="text-gray-400 text-sm mb-6">Are you sure you want to delete this reminder? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 font-semibold text-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteReminder}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition shadow-lg shadow-red-600/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reminders;