import Progress from "../models/Progress.js";


export const addProgress = async (req, res) => {
  try {
    const {
      date,
      weight,
      chest,
      waist,
      hips,
      arms,
      thighs,
      runTime,
      liftingWeight,
    } = req.body;

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    const progress = await Progress.create({
      user: req.userId,
      date,
      weight,
      chest,
      waist,
      hips,
      arms,
      thighs,
      runTime,
      liftingWeight,
    });

    res.status(201).json({
      success: true,
      message: "Progress added successfully",
      progress,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to add progress",
      error: error.message,
    });
  }
};



export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      user: req.userId,
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
};



export const getSingleProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found",
      });
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch progress",
      error: error.message,
    });
  }
};



export const updateProgress = async (req, res) => {
  try {
    const {
      date,
      weight,
      chest,
      waist,
      hips,
      arms,
      thighs,
      runTime,
      liftingWeight,
    } = req.body;

    const progress = await Progress.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found",
      });
    }

    progress.date = date;
    progress.weight = weight;
    progress.chest = chest;
    progress.waist = waist;
    progress.hips = hips;
    progress.arms = arms;
    progress.thighs = thighs;
    progress.runTime = runTime;
    progress.liftingWeight = liftingWeight;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      progress,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to update progress",
      error: error.message,
    });
  }
};



export const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Progress deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete progress",
      error: error.message,
    });
  }
};