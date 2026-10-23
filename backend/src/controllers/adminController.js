import { Auth } from "../models/authModel.js";
import WorkoutName from "../models/workoutModel.js";
import Category from "../models/categoryModel.js";
import Nutrition from "../models/nutritionModel.js";
import Progress from "../models/Progress.js";
import Feedback from "../models/Feedback.js";


export const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalFeedback,
      pendingFeedback,
      resolvedFeedback,
      inProgressFeedback,
      totalWorkouts,
      totalNutrition,
      recentUsers,
      recentFeedback,
    ] = await Promise.all([
      Auth.countDocuments({ role: "user" }),
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: "Pending" }),
      Feedback.countDocuments({ status: "Resolved" }),
      Feedback.countDocuments({ status: "In Progress" }),
      WorkoutName.countDocuments(),
      Nutrition.countDocuments(),
      Auth.find().sort({ createdAt: -1 }).limit(5).select("-password"),
      Feedback.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalFeedback,
        pendingFeedback,
        resolvedFeedback,
        inProgressFeedback,
        totalWorkouts,
        totalNutrition,
        allAccounts: await Auth.countDocuments(),
      },
      recentUsers,
      recentFeedback,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load admin statistics",
      error: error.message,
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await Auth.find().sort({ createdAt: -1 }).select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const [userProgressCount, userFeedbackCount] = await Promise.all([
      Progress.countDocuments({ user: user._id }),
      Feedback.countDocuments({ email: user.email }),
    ]);

    res.status(200).json({
      success: true,
      user,
      activity: {
        progressRecords: userProgressCount,
        feedbacks: userFeedbackCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, username, email, role } = req.body;
    const user = await Auth.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (username && username.trim() !== user.username) {
      const trimmedU = username.trim();
      const exists = await Auth.findOne({
        username: { $regex: new RegExp(`^${trimmedU.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        _id: { $ne: req.params.id },
      });
      if (exists) {
        return res.status(409).json({ success: false, message: "Username already taken" });
      }
      user.username = trimmedU;
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const trimmedE = email.trim().toLowerCase();
      const exists = await Auth.findOne({ email: trimmedE, _id: { $ne: req.params.id } });
      if (exists) {
        return res.status(409).json({ success: false, message: "Email already taken" });
      }
      user.email = trimmedE;
    }

    if (name) user.name = name.trim();
    if (role && ["user", "admin"].includes(role)) user.role = role;

    await user.save();
    const updated = await Auth.findById(user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own logged-in admin account",
      });
    }

    const user = await Auth.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await Progress.deleteMany({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllFeedback = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status && status !== "All" ? { status } : {};
    const feedback = await Feedback.find(filter).sort({ createdAt: -1 });

    const [total, pending, inProgress, resolved] = await Promise.all([
      Feedback.countDocuments(),
      Feedback.countDocuments({ status: "Pending" }),
      Feedback.countDocuments({ status: "In Progress" }),
      Feedback.countDocuments({ status: "Resolved" }),
    ]);

    res.status(200).json({
      success: true,
      feedback,
      counts: { total, pending, inProgress, resolved },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }

    res.status(200).json({
      success: true,
      message: "Feedback status updated successfully",
      feedback,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.status(200).json({
      success: true,
      message: "Feedback entry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await WorkoutName.find()
      .populate("category", "categoryName")
      .sort({ createdAt: -1 });
    const categories = await Category.find().sort({ categoryName: 1 });

    res.status(200).json({ success: true, workouts, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const { workoutName, exerciseName, sets, reps, weight, notes, category, tags } = req.body;
    if (!workoutName || !exerciseName || !sets || !reps || !weight || !category) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const workout = await WorkoutName.create({
      workoutName,
      exerciseName,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      notes: notes || "",
      category,
      tags: tags || "",
    });

    const populated = await WorkoutName.findById(workout._id).populate("category", "categoryName");
    res.status(201).json({ success: true, message: "Workout created successfully", workout: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const updated = await WorkoutName.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("category", "categoryName");
    if (!updated) {
      return res.status(404).json({ success: false, message: "Workout not found" });
    }
    res.status(200).json({ success: true, message: "Workout updated successfully", workout: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const deleted = await WorkoutName.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Workout not found" });
    }
    res.status(200).json({ success: true, message: "Workout deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, nutrition });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createNutrition = async (req, res) => {
  try {
    const { mealType, foodItem, quantity, calories, protein, carbs, fats, date } = req.body;
    if (!mealType || !foodItem || !quantity || !calories) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const item = await Nutrition.create({
      mealType,
      foodItem,
      quantity,
      calories: Number(calories),
      protein: Number(protein || 0),
      carbs: Number(carbs || 0),
      fats: Number(fats || 0),
      date: date || new Date().toISOString().split("T")[0],
    });

    res.status(201).json({ success: true, message: "Nutrition item created successfully", nutrition: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateNutrition = async (req, res) => {
  try {
    const updated = await Nutrition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Nutrition item not found" });
    }
    res.status(200).json({ success: true, message: "Nutrition item updated successfully", nutrition: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteNutrition = async (req, res) => {
  try {
    const deleted = await Nutrition.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Nutrition item not found" });
    }
    res.status(200).json({ success: true, message: "Nutrition item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};