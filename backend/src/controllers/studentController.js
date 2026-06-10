// controllers/studentController.js
const Student = require("../models/studentModel");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");

// CREATE STUDENT
const createStudent = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    
    await Student.createStudent(req.body);

    res.status(201).json({
      success: true,
      message: "Student created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL STUDENTS
const getAllStudents = async (req, res, next) => {
  try {
    const [rows] = await Student.getAllStudents();

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// GET STUDENT BY ID
const getStudentById = async (req, res, next) => {
  try {
    const [rows] = await Student.getStudentById(req.params.id);

    if (!rows || rows.length === 0) {
      return next(new AppError("Student not found", 404));
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const studentId = req.params.id;
 

    await Student.updateStudent(studentId, req.body);

    res.json({
      success: true,
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error("Update student error:", error);
    next(error);
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res, next) => {
  try {
    const [result] = await Student.deleteStudent(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Student not found", 404));
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};