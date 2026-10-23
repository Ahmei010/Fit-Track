import Nutrition from "../models/nutritionModel.js";


export const addNutrition = async (req, res) => {
  try {
    const {
      mealType,
      foodItem,
      quantity,
      calories,
      protein,
      carbs,
      fats,
      date,
    } = req.body;

    if (
      !mealType ||
      !foodItem ||
      !quantity ||
      calories === undefined ||
      protein === undefined ||
      carbs === undefined ||
      fats === undefined ||
      !date
    ) {
      return res.status(400).json({
        message: "Please fill all required nutrition fields",
      });
    }

    const nutrition = new Nutrition({
      mealType,
      foodItem,
      quantity,
      calories,
      protein,
      carbs,
      fats,
      date,
    });

    await nutrition.save();

    res.status(201).json({
      message: "Nutrition added successfully",
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding nutrition",
      error: error.message,
    });
  }
};


export const getNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.find().sort({ createdAt: -1 });

    res.status(200).json({
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching nutrition",
      error: error.message,
    });
  }
};


export const getSingleNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id);

    if (!nutrition) {
      return res.status(404).json({
        message: "Nutrition not found",
      });
    }

    res.status(200).json({
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching nutrition",
      error: error.message,
    });
  }
};


export const deleteNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findByIdAndDelete(req.params.id);

    if (!nutrition) {
      return res.status(404).json({
        message: "Nutrition not found",
      });
    }

    res.status(200).json({
      message: "Nutrition deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting nutrition",
      error: error.message,
    });
  }
};



export const updateNutrition = async (req, res) => {
  try {
    const nutrition = await Nutrition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!nutrition) {
      return res.status(404).json({
        message: "Nutrition not found",
      });
    }

    res.status(200).json({
      message: "Nutrition updated successfully",
      nutrition,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating nutrition",
      error: error.message,
    });
  }
};