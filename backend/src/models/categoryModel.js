import mongoose from "mongoose";

const { Schema } = mongoose;

const categoryModel = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model("Category", categoryModel);

export default Category;
export { Category };