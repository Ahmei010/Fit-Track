import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/adminMiddleware.js";
import {
  getAdminStats,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllFeedback,
  updateFeedbackStatus,
  deleteFeedback,
  getAllWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  getAllNutrition,
  createNutrition,
  updateNutrition,
  deleteNutrition,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Apply auth & admin middleware to all admin routes
adminRouter.use(verifyToken, requireAdmin);

// 1. Dashboard Stats
adminRouter.get("/stats", getAdminStats);

// 2. Users Management
adminRouter.get("/users", getAllUsers);
adminRouter.get("/users/:id", getUserById);
adminRouter.put("/users/:id", updateUser);
adminRouter.delete("/users/:id", deleteUser);

// 3. Feedback & Support
adminRouter.get("/feedback", getAllFeedback);
adminRouter.put("/feedback/:id/status", updateFeedbackStatus);
adminRouter.delete("/feedback/:id", deleteFeedback);

// 4. Workouts
adminRouter.get("/workouts", getAllWorkouts);
adminRouter.post("/workouts", createWorkout);
adminRouter.put("/workouts/:id", updateWorkout);
adminRouter.delete("/workouts/:id", deleteWorkout);

// 5. Nutrition
adminRouter.get("/nutrition", getAllNutrition);
adminRouter.post("/nutrition", createNutrition);
adminRouter.put("/nutrition/:id", updateNutrition);
adminRouter.delete("/nutrition/:id", deleteNutrition);

export default adminRouter;
