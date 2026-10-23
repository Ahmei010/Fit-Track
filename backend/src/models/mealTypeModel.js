import mongoose from "mongoose";

const { Schema } = mongoose;

const mealTypeSchema = new Schema(
  {
    mealTypeName: {
      type: String,
      required: [true, "Meal type name is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

const MealType =
  mongoose.models.MealType || mongoose.model("MealType", mealTypeSchema);

export default MealType;
export { MealType };
