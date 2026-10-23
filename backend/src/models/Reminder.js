import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Workout", "Meal", "Fitness Goal"],
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    repeat: {
      type: String,
      enum: ["Once", "Daily", "Weekly"],
      default: "Once",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastNotified: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Reminder", reminderSchema);