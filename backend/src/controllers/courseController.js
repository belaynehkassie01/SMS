const Course = require("../models/courseModel");
const AppError = require("../utils/AppError");

// CREATE
const createCourse = async (req, res, next) => {
  try {
    await Course.createCourse(req.body);

    res.status(201).json({
      success: true,
      message: "Course created successfully",
    });

  } catch (error) {
    next(error);
  }
};

// GET ALL
const getAllCourses = async (req, res, next) => {
  try {
    const [rows] = await Course.getAllCourses();

    res.json({
      success: true,
      data: rows,
    });

  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getCourseById = async (req, res, next) => {
  try {
    const [rows] = await Course.getCourseById(req.params.id);

    if (!rows || rows.length === 0) {
      return next(new AppError("Course not found", 404));
    }

    res.json({
      success: true,
      data: rows[0],
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE
const updateCourse = async (req, res, next) => {
  try {
    const [result] = await Course.updateCourse(
      req.params.id,
      req.body
    );

    if (!result || result.affectedRows === 0) {
      return next(new AppError("Course not found", 404));
    }

    res.json({
      success: true,
      message: "Course updated successfully",
    });

  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteCourse = async (req, res, next) => {
  try {
    const [result] = await Course.deleteCourse(req.params.id);

    if (!result || result.affectedRows === 0) {
      return next(new AppError("Course not found", 404));
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};