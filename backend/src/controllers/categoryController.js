import Category from "../models/categoryModel.js";
import WorkoutName from "../models/workoutModel.js";

export const createCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;

    const categoryExist = await Category.findOne({ categoryName });

    if (categoryExist) {
      return res.status(400).json({
        message: "Category already exists",
      });
    } 

    const newCategory = await Category.create({
      categoryName,
    });

    res.status(201).json({
      message: "New category created successfully",
      newCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categoryData = await Category.find();

    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.status(200).json({
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const assignedCount = await WorkoutName.countDocuments({ category: id });
    if (assignedCount > 0) {
      return res.status(400).json({
        message: `Cannot delete "${category.categoryName}" because it is currently assigned to ${assignedCount} workout(s). Please update those workouts first.`,
      });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};