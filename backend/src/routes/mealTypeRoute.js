import express from "express";
import {
  createMealType,
  getMealTypes,
  updateMealType,
  deleteMealType,
} from "../controllers/mealTypeController.js";

const mealTypeRouter = express.Router();

mealTypeRouter.post("/create", createMealType);
mealTypeRouter.get("/", getMealTypes);
mealTypeRouter.put("/update/:id", updateMealType);
mealTypeRouter.delete("/delete/:id", deleteMealType);

export default mealTypeRouter;
