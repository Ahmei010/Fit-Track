import Reminder from "../models/Reminder.js";


export const addReminder = async (req, res) => {
  try {
    const { title, type, date, time, repeat } = req.body;

    if (!title || !type || !date || !time) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const reminder = await Reminder.create({
      userId: req.userId,
      title,
      type,
      date,
      time,
      repeat: repeat || "Once",
    });

    res.status(201).json({
      message: "Reminder created successfully",
      reminder,
    });
  } catch (error) {
    console.error("ADD REMINDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      userId: req.userId,
    }).sort({
      date: 1,
      time: 1,
    });

    res.status(200).json(reminders);
  } catch (error) {
    console.error("GET REMINDERS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    const {
      title,
      type,
      date,
      time,
      repeat,
      isActive,
    } = req.body;

    reminder.title = title ?? reminder.title;
    reminder.type = type ?? reminder.type;
    reminder.date = date ?? reminder.date;
    reminder.time = time ?? reminder.time;
    reminder.repeat = repeat ?? reminder.repeat;

    if (typeof isActive === "boolean") {
      reminder.isActive = isActive;
    }

    await reminder.save();

    res.status(200).json({
      message: "Reminder updated successfully",
      reminder,
    });
  } catch (error) {
    console.error("UPDATE REMINDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    res.status(200).json({
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    console.error("DELETE REMINDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


export const toggleReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!reminder) {
      return res.status(404).json({
        message: "Reminder not found",
      });
    }

    reminder.isActive = !reminder.isActive;

    await reminder.save();

    res.status(200).json({
      message: reminder.isActive
        ? "Reminder enabled"
        : "Reminder disabled",
      reminder,
    });
  } catch (error) {
    console.error("TOGGLE REMINDER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};