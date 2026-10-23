import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRouter from "./routes/authRoute.js";

import categoryRoute from "./routes/categoryRoute.js";
import workoutRoute from "./routes/workoutRoute.js";
import nutritionRoute from "./routes/nutritionRoute.js";
import progressRouter from "./routes/progressRoute.js";
import feedbackRoute from "./routes/feedbackRoute.js";
import reminderRoute from "./routes/reminderRoute.js";
import adminRoute from "./routes/adminRoute.js";
import mealTypeRoute from "./routes/mealTypeRoute.js";
import { initAdminAccount } from "./utils/initAdmin.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.use("/auth", authRouter);
app.use("/category", categoryRoute);
app.use("/meal-type", mealTypeRoute);
app.use("/workout", workoutRoute);
app.use("/nutrition", nutritionRoute);
app.use("/progress", progressRouter);
app.use("/feedback", feedbackRoute);
app.use("/reminders", reminderRoute);
app.use("/admin", adminRoute);

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fittrack";
mongoose
  .connect(mongoUri, { dbName: "fittrack" })
  .then(async (conn) => {
    console.log(`DB connected successfully to database: ${conn.connection.name}`);
    try {
      await initAdminAccount(false);
    } catch (seedErr) {
      console.warn("Could not check/initialize admin:", seedErr.message);
    }
  })
  .catch((err) => console.error("DB connection error:", err.message));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});