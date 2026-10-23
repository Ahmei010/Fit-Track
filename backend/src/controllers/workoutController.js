import WorkoutName from "../models/workoutModel.js";


export const createWorkout = async (req, res) => {
  try {
    const { workoutName, exerciseName, sets, reps, weight, notes, category, tags, } = req.body;


    if (!workoutName || !exerciseName || !sets || !reps || !weight || !category
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }


    const workoutExist = await WorkoutName.findOne({
      workoutName,
      exerciseName,
    });

    if (workoutExist) {
      return res.status(400).json({
        message: "Workout exercise already exist",
      });
    }

    const addWorkout = await WorkoutName.create({
      workoutName, exerciseName, sets, reps, weight, notes, category, tags,
    });

    res.status(201).json({
      message: "Workout added successfully",
      workout: addWorkout,
    });
  } catch (error) {
    console.error("Create Workout Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export const getWorkout = async (req, res) => {
  try {
    const workoutlists = await WorkoutName.find()
      .populate("category", "categoryName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Workout lists retrieved successfully",
      workoutlists,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


export const getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;

    const workoutDetail = await WorkoutName.findById(id);

    if (!workoutDetail) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      workoutDetail,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server error",
      error: error.message,
    });
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedWorkout = await WorkoutName.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedWorkout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message: "Workout updated successfully",
      workout: updatedWorkout,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWorkout = await WorkoutName.findByIdAndDelete(id);

    if (!deletedWorkout) {
      return res.status(404).json({
        message: "Workout not found",
      });
    }

    res.status(200).json({
      message: "Workout deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};