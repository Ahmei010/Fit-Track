import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, LogIn, Lock, Mail, ShieldAlert } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateField = (name, value) => {
    let err = "";
    const trimmed = value.trim();

    if (name === "identifier") {
      if (!trimmed) {
        err = "Username or email is required";
      } else if (trimmed.includes("@")) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
          err = "Please enter a valid email format";
        }
      }
    } else if (name === "password") {
      if (!value) {
        err = "Password is required";
      }
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const err = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identifierErr = validateField("identifier", formData.identifier);
    const passwordErr = validateField("password", formData.password);

    if (identifierErr || passwordErr) {
      setErrors({
        identifier: identifierErr,
        password: passwordErr,
      });
      return;
    }

    try {
      setLoading(true);

      const trimmedData = {
        username: formData.identifier.trim(),
        password: formData.password,
      };

      const { data } = await axios.post(
        "http://localhost:5000/auth/login",
        trimmedData
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("fittrack_auth_change"));

      // Role-based routing determined strictly by authenticated MongoDB record
      if (data.user?.role === "admin") {
        toast.success("Welcome back, Administrator! Access granted.");
        navigate("/admin-dashboard", { replace: true });
      } else {
        toast.success(data.message || "Signed in successfully!");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        "Invalid username/email or password. Please try again.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow login-glow-one"></div>
      <div className="login-glow login-glow-two"></div>

      <div className="login-card">
        {/* Left Image Section */}
        <div className="login-image-section">
          <img
            src="/login.jpg"
            alt="FitTrack Workout"
            className="login-image"
          />

          <div className="login-image-overlay"></div>
          <div className="login-orange-line"></div>

          <div className="login-logo">
            <div className="login-logo-icon">
              <LogIn size={19} />
            </div>
            <span>
              FIT<span>TRACK</span>
            </span>
          </div>

          <div className="login-image-content">
            <p className="login-small-title">
              YOUR FITNESS. YOUR JOURNEY.
            </p>

            <h1>
              Welcome
              <span> Back.</span>
            </h1>

            <p>
              Stay focused, stay consistent and keep
              moving towards your fitness goals.
            </p>

            <div className="login-line"></div>
          </div>
        </div>

        {/* Right Form Section: Unified Sign In */}
        <div className="login-form-section">
          <div className="login-form-container">
            {/* Unified Portal Badge */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <p className="text-xs font-medium text-orange-400">
                FitTrack Unified Sign In Portal (User &amp; Admin)
              </p>
            </div>

            <div className="login-heading">
              <p className="login-form-label">
                ACCOUNT AUTHENTICATION
              </p>

              <h2>Sign In</h2>

              <p>
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              {/* Username or Email */}
              <div className="login-form-group">
                <label htmlFor="identifier">
                  Username or Email
                </label>

                <div className="relative">
                  <input
                    id="identifier"
                    type="text"
                    name="identifier"
                    placeholder="e.g. alexander or user@example.com"
                    value={formData.identifier}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.identifier ? "border-red-500/60 focus:border-red-500" : ""}
                    required
                    autoComplete="username"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <ShieldAlert size={13} />
                    {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="login-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="login-password-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.password ? "border-red-500/60 focus:border-red-500" : ""}
                    required
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <ShieldAlert size={13} />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Authenticating...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="login-register">
              <span>Don't have an account?</span>
              <Link to="/register">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;