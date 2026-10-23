import { Auth } from "../models/authModel.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await Auth.findById(req.userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access only" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Could not verify admin access" });
  }
};
