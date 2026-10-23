import React from "react";
import Login from "./Login";

/**
 * Shared authentication entrypoint for administrators and members.
 * Unified sign-in authenticates credentials via MongoDB and automatically
 * routes administrators to /admin-dashboard and members to /dashboard.
 */
const AdminLogin = () => {
  return <Login />;
};

export default AdminLogin;
