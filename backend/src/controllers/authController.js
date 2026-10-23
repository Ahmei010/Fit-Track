import { Auth } from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";


export const validatePasswordPolicy = (password) => {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter (A-Z)";
  }
  const letterMatches = password.match(/[a-zA-Z]/g) || [];
  if (letterMatches.length < 6) {
    return "Password must contain at least six alphabetic letters (A-Z, a-z)";
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    return "Password must contain at least one special character (e.g. @, #, $, !)";
  }
  return null;
};

export const registerUser = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({
        message: "Username, name, email and password are required",
      });
    }

    const trimmedUsername = String(username).trim();
    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    // Validate password policy
    const passwordError = validatePasswordPolicy(password);
    if (passwordError) {
      return res.status(400).json({
        message: passwordError,
      });
    }

    const usernameExists = await Auth.findOne({
      username: { $regex: new RegExp(`^${trimmedUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    });

    if (usernameExists) {
      return res.status(409).json({
        message: "Username already exists",
      });
    }

    const emailExists = await Auth.findOne({ email: trimmedEmail });

    if (emailExists) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await Auth.create({
      username: trimmedUsername,
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: "user",
    });

    const user = await Auth.findById(newUser._id).select("-password");

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username or email and password are required",
      });
    }

    const identifier = String(username).trim();


    const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const userExists = await Auth.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${escapedIdentifier}$`, "i") } },
        { email: identifier.toLowerCase() },
      ],
    });

  
    if (!userExists || !(await bcrypt.compare(password, userExists.password))) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const token = jwt.sign(
      { id: userExists._id, role: userExists.role },
      process.env.JWT_SECRET || "abc",
      { expiresIn: "7d" }
    );

    const user = await Auth.findById(userExists._id).select("-password");

    res.status(200).json({
      message: "Login successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};

export const userProfile = async (req, res) => {
  try {
    const user = await Auth.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await Auth.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { username, name, email } = req.body;

    if (username && username.trim() !== user.username) {
      const trimmedU = username.trim();
      const usernameExists = await Auth.findOne({
        username: { $regex: new RegExp(`^${trimmedU.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        _id: { $ne: req.userId },
      });

      if (usernameExists) {
        return res.status(409).json({
          message: "Username already exists",
        });
      }

      user.username = trimmedU;
    }

    if (name && name.trim()) {
      user.name = name.trim();
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const emailExists = await Auth.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: req.userId },
      });

      if (emailExists) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      user.email = email.trim().toLowerCase();
    }

    if (req.file) {
      if (user.profilePicture) {
        const oldImagePath = path.join(process.cwd(), user.profilePicture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      user.profilePicture = `/uploads/profile/${req.file.filename}`;
    }

    await user.save();

    const updatedUser = await Auth.findById(req.userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      message: "Profile update failed",
      error: error.message,
    });
  }
};