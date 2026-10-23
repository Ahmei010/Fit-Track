import express from "express";
import {loginUser,registerUser,userProfile,updateProfile,} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import uploadProfilePicture from "../middlewares/uploadMiddleware.js";

const authRouter = express.Router();


authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", verifyToken, userProfile);
authRouter.put("/profile",verifyToken, uploadProfilePicture.single("profilePicture"),updateProfile );

export default authRouter;