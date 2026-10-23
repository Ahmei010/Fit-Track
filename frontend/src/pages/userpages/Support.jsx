import React, { useState } from "react";
import axios from "axios";
import {
  Headphones,
  Bug,
  MessageSquare,
  Send,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

const Support = () => {
  const [activeTab, setActiveTab] = useState("support");

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSuccess("");
  setError("");

  if (!form.name.trim()) {
    setError("Please enter your name.");
    return;
  }

  if (!form.email.trim()) {
    setError("Please enter your email.");
    return;
  }

  if (!form.subject.trim()) {
    setError("Please enter a subject.");
    return;
  }

  if (!form.message.trim()) {
    setError("Please write your message.");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const type =
      activeTab === "support"
        ? "Support"
        : activeTab === "issue"
        ? "Issue"
        : "Feedback";

    const response = await axios.post(
      "http://localhost:5000/feedback",
      {
        name: form.name,
        email: form.email,
        type,
        subject: form.subject,
        message: form.message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSuccess(response.data.message);

    setForm({
      name: user.name || "",
      email: user.email || "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error(error);

    setError(
      error.response?.data?.message ||
        "Unable to submit your request."
    );
  }
};

  return (
    <div className="w-full text-white animate-fade-in-up pb-10">

      {/* PAGE HEADER */}
      <div className="mb-7">

        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Headphones
              size={24}
              className="text-orange-500"
            />
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Feedback & Support
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Contact us, report an issue, or share your feedback.
            </p>
          </div>
        </div>

      </div>


      {/* SUPPORT INFORMATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7">

        {/* EMAIL */}
        <div className="bg-[#111116] rounded-2xl border border-white/10 p-5 shadow-lg">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Mail
                size={20}
                className="text-orange-500"
              />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Email Support
              </h3>

              <p className="text-xs text-gray-400">
                Contact our team
              </p>
            </div>

          </div>

          <p className="text-sm text-gray-300">
            support@fittrack.com
          </p>

        </div>


        {/* PHONE */}
        <div className="bg-[#111116] rounded-2xl border border-white/10 p-5 shadow-lg">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Phone
                size={20}
                className="text-orange-500"
              />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Phone Support
              </h3>

              <p className="text-xs text-gray-400">
                Get direct assistance
              </p>
            </div>

          </div>

          <p className="text-sm text-gray-300">
            +92 300 0000000
          </p>

        </div>


        {/* RESPONSE TIME */}
        <div className="bg-[#111116] rounded-2xl border border-white/10 p-5 shadow-lg">

          <div className="flex items-center gap-3 mb-3">

            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Clock
                size={20}
                className="text-orange-500"
              />
            </div>

            <div>
              <h3 className="font-semibold text-white">
                Response Time
              </h3>

              <p className="text-xs text-gray-400">
                Support availability
              </p>
            </div>

          </div>

          <p className="text-sm text-gray-300">
            Within 24–48 hours
          </p>

        </div>

      </div>


      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT OPTIONS */}
        <div className="bg-[#111116] border border-white/10 rounded-2xl p-5 h-fit shadow-lg">

          <h2 className="text-white text-lg font-semibold mb-5">
            How can we help?
          </h2>


          {/* CONTACT SUPPORT */}
          <button
            onClick={() => {
              setActiveTab("support");
              setSuccess("");
              setError("");
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-xl mb-3 text-left transition ${
              activeTab === "support"
                ? "bg-orange-500 text-white font-bold"
                : "bg-[#16161f] text-gray-300 hover:bg-[#202028]"
            }`}
          >

            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeTab === "support"
                  ? "bg-white/20"
                  : "bg-orange-500/10"
              }`}
            >
              <Headphones
                size={20}
                className={
                  activeTab === "support"
                    ? "text-white"
                    : "text-orange-500"
                }
              />
            </div>

            <div>
              <p className="font-semibold">
                Contact Support
              </p>

              <span className="text-xs opacity-70">
                Need assistance?
              </span>
            </div>

          </button>


          {/* REPORT ISSUE */}
          <button
            onClick={() => {
              setActiveTab("issue");
              setSuccess("");
              setError("");
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-xl mb-3 text-left transition ${
              activeTab === "issue"
                ? "bg-orange-500 text-white font-bold"
                : "bg-[#16161f] text-gray-300 hover:bg-[#202028]"
            }`}
          >

            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeTab === "issue"
                  ? "bg-white/20"
                  : "bg-red-500/10"
              }`}
            >
              <Bug
                size={20}
                className={
                  activeTab === "issue"
                    ? "text-white"
                    : "text-red-400"
                }
              />
            </div>

            <div>
              <p className="font-semibold">
                Report an Issue
              </p>

              <span className="text-xs opacity-70">
                Found something wrong?
              </span>
            </div>

          </button>


          {/* FEEDBACK */}
          <button
            onClick={() => {
              setActiveTab("feedback");
              setSuccess("");
              setError("");
            }}
            className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition ${
              activeTab === "feedback"
                ? "bg-orange-500 text-white font-bold"
                : "bg-[#16161f] text-gray-300 hover:bg-[#202028]"
            }`}
          >

            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeTab === "feedback"
                  ? "bg-white/20"
                  : "bg-green-500/10"
              }`}
            >
              <Lightbulb
                size={20}
                className={
                  activeTab === "feedback"
                    ? "text-white"
                    : "text-green-400"
                }
              />
            </div>

            <div>
              <p className="font-semibold">
                Give Feedback
              </p>

              <span className="text-xs opacity-70">
                Share your suggestions
              </span>
            </div>

          </button>


          {/* SUPPORT NOTE */}
          <div className="mt-6 p-4 rounded-xl bg-[#16161f] border border-white/5">

            <div className="flex gap-3">

              <CheckCircle
                size={18}
                className="text-orange-500 mt-0.5 flex-shrink-0"
              />

              <p className="text-xs leading-5 text-gray-400">
                Our support team reviews every request and works
                to provide a helpful response as quickly as possible.
              </p>

            </div>

          </div>

        </div>


        {/* FORM */}
        <div className="lg:col-span-2 bg-[#111116] rounded-2xl border border-white/10 shadow-lg p-5 md:p-7">

          {/* FORM TITLE */}
          <div className="mb-6">

            <div className="flex items-center gap-3">

              {activeTab === "support" && (
                <Headphones
                  size={23}
                  className="text-orange-500"
                />
              )}

              {activeTab === "issue" && (
                <Bug
                  size={23}
                  className="text-orange-500"
                />
              )}

              {activeTab === "feedback" && (
                <MessageSquare
                  size={23}
                  className="text-orange-500"
                />
              )}

              <h2 className="text-xl font-bold text-white">
                {activeTab === "support" &&
                  "Contact Support"}

                {activeTab === "issue" &&
                  "Report an Issue"}

                {activeTab === "feedback" &&
                  "Send Feedback"}
              </h2>

            </div>

            <p className="text-sm text-gray-400 mt-2">
              {activeTab === "support" &&
                "Tell us how we can assist you."}

              {activeTab === "issue" &&
                "Describe the issue you are experiencing."}

              {activeTab === "feedback" &&
                "Help us improve FitTrack with your feedback."}
            </p>

          </div>


          {/* SUCCESS */}
          {success && (
            <div className="mb-5 flex gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">

              <CheckCircle
                size={20}
                className="text-green-500 flex-shrink-0"
              />

              <p className="text-sm text-green-400">
                {success}
              </p>

            </div>
          )}


          {/* ERROR */}
          {error && (
            <div className="mb-5 flex gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">

              <AlertCircle
                size={20}
                className="text-red-500 flex-shrink-0"
              />

              <p className="text-sm text-red-400">
                {error}
              </p>

            </div>
          )}


          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME + EMAIL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={user.name || "Enter your name"}
                  className="w-full px-4 py-3 rounded-xl bg-[#16161f] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 transition"
                />
              </div>


              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={user.email || "Enter your email"}
                  className="w-full px-4 py-3 rounded-xl bg-[#16161f] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 transition"
                />
              </div>

            </div>


            {/* SUBJECT */}
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder={
                  activeTab === "issue"
                    ? "Example: Unable to add workout"
                    : activeTab === "feedback"
                    ? "Example: Suggestion for dashboard"
                    : "How can we help you?"
                }
                className="w-full px-4 py-3 rounded-xl bg-[#16161f] border border-white/10 text-white placeholder-gray-500 outline-none focus:border-orange-500 transition"
              />

            </div>


            {/* MESSAGE */}
            <div>

              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows="7"
                placeholder={
                  activeTab === "issue"
                    ? "Describe the issue and what happened..."
                    : activeTab === "feedback"
                    ? "Write your feedback or suggestion..."
                    : "Write your message..."
                }
                className="w-full px-4 py-3 rounded-xl bg-[#16161f] border border-white/10 text-white placeholder-gray-500 outline-none resize-none focus:border-orange-500 transition"
              />

            </div>


            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60 shadow-lg shadow-orange-500/20"
            >

              <Send size={18} />

              {loading
                ? "Submitting..."
                : activeTab === "issue"
                ? "Report Issue"
                : activeTab === "feedback"
                ? "Send Feedback"
                : "Contact Support"}

            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Support;