import bcrypt from "bcryptjs";
import { Auth } from "../models/authModel.js";


export const initAdminAccount = async (forceReset = false) => {
  const username = (process.env.ADMIN_USERNAME || "admin").trim();
  const name = (process.env.ADMIN_NAME || "FitTrack Admin").trim();
  const email = (process.env.ADMIN_EMAIL || "admin@example.com").trim().toLowerCase();
  const rawPassword = process.env.ADMIN_PASSWORD || "Admin@123";


  const existingAdmin = await Auth.findOne({ role: "admin" });

  if (existingAdmin && !forceReset) {
    console.log(`[FitTrack Auth] Admin account verified in MongoDB: "${existingAdmin.username}" (${existingAdmin.email})`);
    return { created: false, admin: existingAdmin };
  }

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  if (existingAdmin && forceReset) {
    existingAdmin.username = username;
    existingAdmin.name = name;
    existingAdmin.email = email;
    existingAdmin.password = hashedPassword;
    await existingAdmin.save();
    console.log(`[FitTrack Auth] Admin account force-updated successfully from environment variables.`);
    return { created: false, updated: true, admin: existingAdmin };
  }

 
  let userRecord = await Auth.findOne({ $or: [{ username }, { email }] });
  if (userRecord) {
    userRecord.role = "admin";
    userRecord.password = hashedPassword;
    await userRecord.save();
    console.log(`[FitTrack Auth] Existing record promoted to admin role in MongoDB: "${userRecord.username}"`);
    return { created: false, updated: true, admin: userRecord };
  }

  const newAdmin = await Auth.create({
    username,
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`[FitTrack Auth] Initial admin account created successfully in MongoDB: "${newAdmin.username}" (${newAdmin.email})`);
  return { created: true, admin: newAdmin };
};
