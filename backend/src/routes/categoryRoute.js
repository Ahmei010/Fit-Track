import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", createCategory);

router.get("/", getCategories);

router.put("/update/:id", updateCategory);

router.delete("/delete/:id", deleteCategory);

export default router;