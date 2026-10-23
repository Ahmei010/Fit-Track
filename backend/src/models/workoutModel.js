import mongoose from "mongoose";

const { Schema } = mongoose;

const workoutModel = new Schema(
  {
    workoutName: {
      type: String,
      required: true,
    },

    exerciseName: {
      type: String,
      required: true,
    },

    sets: {
      type: Number,
      required: true,
    },

    reps: {
      type: Number,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    notes: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const WorkoutName =
  mongoose.models.Workouts || mongoose.model("Workouts", workoutModel);

export default WorkoutName;
export { WorkoutName };