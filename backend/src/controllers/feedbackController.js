import Feedback from "../models/Feedback.js";

// Create Support / Issue / Feedback
export const createFeedback = async (req, res) => {
  try {
    const { name, email, type, subject, message } = req.body;

    if (!name || !email || !type || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const feedback = await Feedback.create({
      name,
      email,
      type,
      subject,
      message,
    });

    res.status(201).json({
      message: "Your request has been submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Feedback Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const getMyFeedback = async (req, res) => {
  try {
    const { email } = req.query;

    const feedback = await Feedback.find(
      email ? { email } : {}
    ).sort({ createdAt: -1 });

    res.status(200).json({
      feedback,
    });
  } catch (error) {
    console.error("Get Feedback Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};