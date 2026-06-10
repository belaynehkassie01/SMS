// controllers/teacherController.js
const Teacher = require("../models/teacherModel");
const AppError = require("../utils/AppError");

// CREATE
const createTeacher = async (req, res, next) => {
  try {
    
    await Teacher.createTeacher(req.body);

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
    });

  } catch (error) {
    next(error);
  }
};

// GET ALL
const getAllTeachers = async (req, res, next) => {
  try {
    const [rows] = await Teacher.getAllTeachers();
    

    res.json({
      success: true,
      data: rows,
    });

  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getTeacherById = async (req, res, next) => {
  try {
    const [rows] = await Teacher.getTeacherById(req.params.id);

    if (!rows || rows.length === 0) {
      return next(new AppError("Teacher not found", 404));
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
const updateTeacher = async (req, res, next) => {
  try {
    

    await Teacher.updateTeacher(req.params.id, req.body);

    res.json({
      success: true,
      message: "Teacher updated successfully",
    });

  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteTeacher = async (req, res, next) => {
  try {
    const [result] = await Teacher.deleteTeacher(req.params.id);

    if (!result || result.affectedRows === 0) {
      return next(new AppError("Teacher not found", 404));
    }

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};