import "dotenv/config";
import mongoose from "mongoose";
import { initAdminAccount } from "./src/utils/initAdmin.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fittrack";
const forceReset = process.argv.includes("--force") || process.argv.includes("--reset");

try {
  const conn = await mongoose.connect(MONGO_URI, { dbName: "fittrack" });
  console.log(`Connected to MongoDB Atlas (${conn.connection.name}) for admin initialization...`);

  const result = await initAdminAccount(forceReset);

  if (!result.created && !result.updated) {
    console.log("Admin account already exists in MongoDB. Current password preserved.");
    console.log("To force overwrite credentials with .env values, run: node seedAdmin.js --force");
  } else {
    console.log("Admin account configured successfully in MongoDB.");
  }
} catch (error) {
  console.error("Error during admin initialization:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
  console.log("Database disconnected.");
}
