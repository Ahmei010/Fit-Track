import MealType from "../models/mealTypeModel.js";
import Nutrition from "../models/nutritionModel.js";


const DEFAULT_MEAL_TYPES = [
  { mealTypeName: "Breakfast", description: "Morning meal" },
  { mealTypeName: "Lunch", description: "Midday meal" },
  { mealTypeName: "Dinner", description: "Evening meal" },
  { mealTypeName: "Snacks", description: "Light bites and snacks" },
];


export const createMealType = async (req, res) => {
  try {
    const { mealTypeName, description } = req.body;

    if (!mealTypeName || !mealTypeName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Meal type name is required",
      });
    }

    const trimmedName = mealTypeName.trim();

   
    const existing = await MealType.findOne({
      mealTypeName: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Meal type "${trimmedName}" already exists`,
      });
    }

    const newMealType = await MealType.create({
      mealTypeName: trimmedName,
      description: description ? description.trim() : "",
    });

    res.status(201).json({
      success: true,
      message: "Meal type created successfully",
      mealType: newMealType,
    });
  } catch (error) {
    console.error("Create Meal Type Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create meal type",
    });
  }
};


export const getMealTypes = async (req, res) => {
  try {
    let mealTypes = await MealType.find().sort({ createdAt: 1 });

  
    if (mealTypes.length === 0) {
      try {
        await MealType.insertMany(DEFAULT_MEAL_TYPES);
        mealTypes = await MealType.find().sort({ createdAt: 1 });
      } catch (seedErr) {
        console.warn("Could not auto-seed default meal types:", seedErr.message);
      }
    }

    res.status(200).json({
      success: true,
      mealTypes,
    });
  } catch (error) {
    console.error("Get Meal Types Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch meal types",
    });
  }
};


export const updateMealType = async (req, res) => {
  try {
    const { id } = req.params;
    const { mealTypeName, description } = req.body;

    if (!mealTypeName || !mealTypeName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Meal type name is required",
      });
    }

    const trimmedName = mealTypeName.trim();

 
    const existing = await MealType.findOne({
      mealTypeName: { $regex: new RegExp(`^${trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      _id: { $ne: id },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Meal type "${trimmedName}" already exists`,
      });
    }

    const currentMealType = await MealType.findById(id);
    if (!currentMealType) {
      return res.status(404).json({
        success: false,
        message: "Meal type not found",
      });
    }

    const oldName = currentMealType.mealTypeName;

    currentMealType.mealTypeName = trimmedName;
    if (description !== undefined) {
      currentMealType.description = description.trim();
    }
    await currentMealType.save();


    if (oldName !== trimmedName) {
      await Nutrition.updateMany(
        { mealType: oldName },
        { $set: { mealType: trimmedName } }
      );
    }

    res.status(200).json({
      success: true,
      message: "Meal type updated successfully",
      mealType: currentMealType,
    });
  } catch (error) {
    console.error("Update Meal Type Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update meal type",
    });
  }
};


export const deleteMealType = async (req, res) => {
  try {
    const { id } = req.params;

    const mealType = await MealType.findById(id);
    if (!mealType) {
      return res.status(404).json({
        success: false,
        message: "Meal type not found",
      });
    }


    const associatedCount = await Nutrition.countDocuments({
      mealType: mealType.mealTypeName,
    });

    if (associatedCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${mealType.mealTypeName}" because it is currently assigned to ${associatedCount} nutrition record(s). Please reassign or update those records first.`,
        associatedCount,
      });
    }

    await MealType.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Meal type deleted successfully",
    });
  } catch (error) {
    console.error("Delete Meal Type Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete meal type",
    });
  }
};
