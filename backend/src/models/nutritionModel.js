import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema(
  {
    mealType: {
      type: String,
      required: true,
    },

    foodItem: {
      type: String,
      required: true,
    },

    quantity: {
      type: String,
      required: true,
    },

    calories: {
      type: Number,
      required: true,
    },

    protein: {
      type: Number,
      required: true,
    },

    carbs: {
      type: Number,
      required: true,
    },

    fats: {
      type: Number,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Nutrition =
  mongoose.models.Nutrition ||
  mongoose.model("Nutrition", nutritionSchema);

export default Nutrition;
export { Nutrition };
