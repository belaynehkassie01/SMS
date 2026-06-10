const Result = require("../models/resultModel");
const AppError = require("../utils/AppError");

/* =========================
   CREATE
========================= */
const createResult = async (req, res, next) => {
  try {
    await Result.createResult(req.body);

    res.status(201).json({
      success: true,
      message: "Result created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL - MODIFIED TO FILTER BY STUDENT ROLE
========================= */
const getAllResults = async (req, res, next) => {
  try {
    let rows;
    
    // If user is Student, only get their own results
    if (req.user.role === 'Student') {
      [rows] = await Result.getResultsByStudent(req.user.id);
    } else {
      // Admin and Teacher get all results
      [rows] = await Result.getAllResults();
    }

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET BY ID - ADD OWNERSHIP CHECK
========================= */
const getResultById = async (req, res, next) => {
  try {
    const [rows] = await Result.getResultById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Result not found", 404));
    }

    const result = rows[0];
    
    // If user is Student, check if this result belongs to them
    if (req.user.role === 'Student' && result.StudentID !== req.user.id) {
      return next(new AppError("Access denied. You can only view your own results.", 403));
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE
========================= */
const updateResult = async (req, res, next) => {
  try {
    const [result] = await Result.updateResult(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Result not found", 404));
    }

    res.json({
      success: true,
      message: "Result updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deleteResult = async (req, res, next) => {
  try {
    const [result] = await Result.deleteResult(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Result not found", 404));
    }

    res.json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  deleteResult,
};