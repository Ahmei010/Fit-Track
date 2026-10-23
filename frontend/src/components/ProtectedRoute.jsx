import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem("token");
  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    localStorage.removeItem("user");
  }

  if (!token) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === "admin" ? "/admin-dashboard" : "/dashboard"} replace />;
  }

  if (!requiredRole && user.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
