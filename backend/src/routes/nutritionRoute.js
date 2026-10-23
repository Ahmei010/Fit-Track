import express from "express";

import {
  addNutrition,
  getNutrition,
  getSingleNutrition,
  deleteNutrition,
  updateNutrition,
} from "../controllers/nutritionController.js";

const nutritionRoute = express.Router();

nutritionRoute.post("/add", addNutrition);

nutritionRoute.get("/", getNutrition);

nutritionRoute.get("/:id", getSingleNutrition);

nutritionRoute.put("/:id", updateNutrition);

nutritionRoute.delete("/:id", deleteNutrition);

export default nutritionRoute;