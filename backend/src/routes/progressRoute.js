import express from "express";

import {
  addProgress,
  getProgress,
  getSingleProgress,
  updateProgress,
  deleteProgress,
} from "../controllers/progressController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const progressRouter = express.Router();


// Add Progress
progressRouter.post(
  "/add",
  verifyToken,
  addProgress
);


// Get All User Progress
progressRouter.get(
  "/",
  verifyToken,
  getProgress
);


// Get Single Progress
progressRouter.get(
  "/:id",
  verifyToken,
  getSingleProgress
);


// Update Progress
progressRouter.put(
  "/:id",
  verifyToken,
  updateProgress
);


// Delete Progress
progressRouter.delete(
  "/:id",
  verifyToken,
  deleteProgress
);

export default progressRouter;