import { lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/frontendcomponents/Navbar";
import Footer from "./components/frontendcomponents/Footer";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./pages/frontendpages/Home"));
const About = lazy(() => import("./pages/frontendpages/AboutUs"));
const Blog = lazy(() => import("./pages/frontendpages/Blogs"));
const Gallery = lazy(() => import("./pages/frontendpages/Gallery"));
const ContactUs = lazy(() => import("./pages/frontendpages/ContactUs"));

import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import UserProfile from "./pages/auth/UserProfile";

import Dashboard from "./pages/userpages/Dashboard";
import AddCategory from "./pages/userpages/AddCategory";
import AddMealType from "./pages/userpages/AddMealType";
import AddWorkout from "./pages/userpages/AddWorkout";
import AddNutrition from "./pages/userpages/AddNutrition";
import AddProgress from "./pages/userpages/AddProgress";
import ProgressList from "./pages/userpages/ProgressList";
import EditProgress from "./pages/userpages/EditProgress";
import ProgressChart from "./pages/userpages/ProgressChart";

import NutritionList from "./components/usercomponents/NutritionList";
import SideBar from "./components/usercomponents/SideBar";
import Header from "./components/usercomponents/Header";
import Settings from "./components/usercomponents/Setting";
import Reminders from "./pages/userpages/Reminders";

// ── Protected Route ───────────────────────────────────────
import ProtectedRoute from "./components/ProtectedRoute";
import Support from "./pages/userpages/Support";
import Analytics from "./pages/userpages/Analytics";
import Reports from "./pages/userpages/Reports";

// ── Admin Pages & Components ──────────────────────────────
import AdminDashboard from "./pages/adminpages/AdminDashboard";
import AdminUsers from "./pages/adminpages/AdminUsers";
import AdminFeedback from "./pages/adminpages/AdminFeedback";
import AdminWorkouts from "./pages/adminpages/AdminWorkouts";
import AdminNutrition from "./pages/adminpages/AdminNutrition";
import AdminSidebar from "./components/admincomponents/AdminSidebar";
import AdminHeader from "./components/admincomponents/AdminHeader";

// ── Public Layout (Navbar + Footer wrap) ──────────────────
const PublicLayout = () => (
  <>
    <Navbar />
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <Outlet />
    </Suspense>
    <Footer />
  </>
);

// ── Admin Dashboard Layout ────────────────────────────────
const AdminLayout = () => (
  <div className="min-h-screen bg-[#0d0d12]">
    <AdminSidebar />
    <AdminHeader />
    <main className="lg:ml-64 pt-20 min-h-screen">
      <Outlet />
    </main>
  </div>
);

// ── User Dashboard Layout ─────────────────────────────────
const DashboardLayout = () => (
  <div className="min-h-screen bg-[#080808]">
    <SideBar />
    <Header />
    <main className="lg:ml-64 pt-24 sm:pt-28 min-h-screen px-4 sm:px-8 pb-16 bg-[#080808]">
      <Outlet />
    </main>
  </div>
);

// ── App ───────────────────────────────────────────────────
const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* ── Public Routes (Navbar + Footer) ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<ContactUs />} />
        </Route>

        {/* ── Auth Routes (no layout) ── */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* ── Protected User Dashboard Routes ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-category" element={<AddCategory />} />
            <Route path="/meal-types" element={<AddMealType />} />
            <Route path="/add-workout" element={<AddWorkout />} />
            <Route path="/add-nutrition" element={<AddNutrition />} />
            <Route path="/progress" element={<ProgressList />} />
            <Route path="/progress/add" element={<AddProgress />} />
            <Route path="/progress/edit/:id" element={<EditProgress />} />
            <Route path="/progress/charts" element={<ProgressChart />} />
            <Route path="/support" element={<Support />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/nutrition" element={<NutritionList />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/setting" element={<Settings />} />
          </Route>
        </Route>

        {/* ── Protected Admin Dashboard Routes ── */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/workouts" element={<AdminWorkouts />} />
            <Route path="/admin/nutrition" element={<AdminNutrition />} />
          </Route>
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;