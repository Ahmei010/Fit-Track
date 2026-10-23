import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, UserPlus, Check, X, ShieldAlert } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Password Policy Checks
  const hasUppercase = /[A-Z]/.test(formData.password);
  const letterMatches = formData.password.match(/[a-zA-Z]/g) || [];
  const hasSixLetters = letterMatches.length >= 6;
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(formData.password);
  const isPasswordValid = hasUppercase && hasSixLetters && hasSpecial;
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email.trim());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      username: true,
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const trimmedUsername = formData.username.trim();
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedUsername || !trimmedName || !trimmedEmail || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isEmailValid) {
      toast.error("Please provide a valid email address");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password does not meet the complexity requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: trimmedUsername,
        name: trimmedName,
        email: trimmedEmail,
        password: formData.password,
      };

      const { data } = await axios.post("http://localhost:5000/auth/register", payload);

      toast.success(data.message || "Account created successfully! Please sign in.");
      navigate("/login");
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-glow register-glow-one"></div>
      <div className="register-glow register-glow-two"></div>

      <div className="register-card">
        {/* Left Side Graphic */}
        <div className="register-image-section">
          <img src="/register.jpg" alt="FitTrack Gym" className="register-image" />
          <div className="register-image-overlay"></div>

          <div className="register-logo">
            <div className="register-logo-icon">
              <UserPlus size={20} />
            </div>
            <span>
              FIT<span>TRACK</span>
            </span>
          </div>

          <div className="register-image-content">
            <p className="register-small-title">START YOUR JOURNEY</p>
            <h1>
              Build a <span>Stronger</span> You.
            </h1>
            <p>
              Create your FitTrack account and take control of your fitness journey.
            </p>
            <div className="register-line"></div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="register-form-section">
          <div className="register-form-container">
            <div className="register-heading">
              <p className="register-form-label">WELCOME TO FITTRACK</p>
              <h2>Create Account</h2>
              <p>Enter your details below to start tracking your progress.</p>
            </div>

            <form onSubmit={handleSubmit} className="register-form" noValidate>
              {/* Username */}
              <div className="form-group">
                <label htmlFor="reg-username">Username</label>
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="username"
                />
                {touched.username && !formData.username.trim() && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <ShieldAlert size={12} /> Username is required
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="name"
                />
                {touched.name && !formData.name.trim() && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <ShieldAlert size={12} /> Full name is required
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  autoComplete="email"
                />
                {touched.email && (!formData.email.trim() || !isEmailValid) && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <ShieldAlert size={12} /> Please enter a valid email address
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="password-wrapper">
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Policy Checklist */}
                <div className="mt-2.5 p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1.5 text-xs">
                  <p className="text-gray-400 font-medium pb-1 border-b border-white/5">
                    Password Policy Requirements:
                  </p>
                  <div className="flex items-center gap-2">
                    {hasUppercase ? (
                      <Check size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <X size={14} className="text-gray-500 shrink-0" />
                    )}
                    <span className={hasUppercase ? "text-emerald-400" : "text-gray-400"}>
                      At least 1 uppercase letter (A–Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasSixLetters ? (
                      <Check size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <X size={14} className="text-gray-500 shrink-0" />
                    )}
                    <span className={hasSixLetters ? "text-emerald-400" : "text-gray-400"}>
                      At least 6 alphabetic letters (A–Z, a–z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasSpecial ? (
                      <Check size={14} className="text-emerald-400 shrink-0" />
                    ) : (
                      <X size={14} className="text-gray-500 shrink-0" />
                    )}
                    <span className={hasSpecial ? "text-emerald-400" : "text-gray-400"}>
                      At least 1 special character (@, #, $, !, etc.)
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="reg-confirm-password">Confirm Password</label>
                <div className="password-wrapper">
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.confirmPassword.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-1 text-xs">
                    {passwordsMatch ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X size={13} className="text-red-400" />
                        <span className="text-red-400">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button type="submit" className="register-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="register-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="register-login">
              <span>Already have an account?</span>
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;