import express from "express";

import {
  addReminder,
  getReminders,
  updateReminder,
  deleteReminder,
  toggleReminder,
} from "../controllers/reminderController.js";

import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addReminder);

router.get("/", verifyToken, getReminders);

router.put("/:id", verifyToken, updateReminder);

router.delete("/:id", verifyToken, deleteReminder);

router.patch("/:id/toggle", verifyToken, toggleReminder);

export default router;