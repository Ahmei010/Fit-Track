import express from "express";

import {
  createFeedback,
  getMyFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", createFeedback);

router.get("/my", getMyFeedback);

export default router;