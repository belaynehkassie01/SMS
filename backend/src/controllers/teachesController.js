// backend/src/controllers/teachesController.js
const Teaches = require("../models/teachesModel");
const AppError = require("../utils/AppError");

// Get all teaches
const getAllTeaches = async (req, res, next) => {
  try {
    const [rows] = await Teaches.getAllTeaches();
    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// Get teaches by ID - ADD THIS FUNCTION
const getTeachesById = async (req, res, next) => {
  try {
    const [rows] = await Teaches.getTeachesById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Assignment not found", 404));
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// Create teaches
const createTeaches = async (req, res, next) => {
  try {
    const { TeacherID, SectionID, CourseID, IsPrimaryTeacher } = req.body;

    // Check if assignment already exists
    const [existing] = await Teaches.checkDuplicate(TeacherID, SectionID);
    if (existing.length > 0) {
      return next(new AppError("Teacher already assigned to this section", 400));
    }

    await Teaches.createTeaches(req.body);
    res.status(201).json({
      success: true,
      message: "Teacher assigned successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update teaches
const updateTeaches = async (req, res, next) => {
  try {
    const [result] = await Teaches.updateTeaches(req.params.id, req.body);

    if (result.affectedRows === 0) {
      return next(new AppError("Assignment not found", 404));
    }

    res.json({
      success: true,
      message: "Assignment updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete teaches
const deleteTeaches = async (req, res, next) => {
  try {
    const [result] = await Teaches.deleteTeaches(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Assignment not found", 404));
    }

    res.json({
      success: true,
      message: "Assignment removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTeaches,
  getTeachesById,  
  createTeaches,
  updateTeaches,
  deleteTeaches,
};