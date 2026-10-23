import express from "express";

import {
  createWorkout,
  getWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workoutController.js";

const router = express.Router();


router.post("/", createWorkout);

router.get("/", getWorkout);

router.get("/:id", getWorkoutById);


router.put("/:id", updateWorkout);

router.delete("/:id", deleteWorkout);

export default router;