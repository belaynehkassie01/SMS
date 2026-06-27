// controllers/studentController.js
const Student = require("../models/studentModel");
const AppError = require("../utils/AppError");
const { validationResult } = require("express-validator");

// CREATE STUDENT
const createStudent = async (req, res, next) => {
  try {
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
    console.error("❌ Create student error:", error);
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
    console.error("❌ Get all students error:", error);
    next(error);
  }
};

// GET STUDENT BY ID
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log('📌 Getting student with ID:', id);
    
    const [rows] = await Student.getStudentById(id);

    if (!rows || rows.length === 0) {
      console.log('❌ Student not found with ID:', id);
      return next(new AppError(`Student with ID ${id} not found`, 404));
    }

    console.log('✅ Student found:', rows[0].StudentID);
    
    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("❌ Get student error:", error);
    next(error);
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }

    const { id } = req.params;
    console.log('📌 Updating student with ID:', id);
    console.log('📌 Request body:', req.body);

    const result = await Student.updateStudent(id, req.body);

    console.log('✅ Student updated successfully');

    res.json({
      success: true,
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error("❌ Update student error:", error);
    next(error);
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log('📌 Deleting student with ID:', id);
    
    if (!id) {
      return next(new AppError('Student ID is required', 400));
    }
    
    const result = await Student.deleteStudent(id);
    
    console.log('📌 Delete result:', result);
    
    const affectedRows = result?.affectedRows || result?.[0]?.affectedRows || 0;
    
    if (affectedRows === 0) {
      console.log('❌ Student not found with ID:', id);
      return next(new AppError(`Student with ID ${id} not found`, 404));
    }
    
    res.json({
      success: true,
      message: 'Student deleted successfully',
    });
    
  } catch (error) {
    console.error('❌ Delete error:', error);
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