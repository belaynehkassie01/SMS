const Exam = require("../models/examModel");
const AppError = require("../utils/AppError");

/* =========================
   CREATE
========================= */
const createExam = async (req, res, next) => {
  try {
    await Exam.createExam(req.body);

    res.status(201).json({
      success: true,
      message: "Exam created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL
========================= */
const getAllExams = async (req, res, next) => {
  try {
    const [rows] = await Exam.getAllExams();

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET BY ID
========================= */
const getExamById = async (req, res, next) => {
  try {
    const [rows] = await Exam.getExamById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Exam not found", 404));
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE
========================= */
const updateExam = async (req, res, next) => {
  try {
    const [result] = await Exam.updateExam(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Exam not found", 404));
    }

    res.json({
      success: true,
      message: "Exam updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deleteExam = async (req, res, next) => {
  try {
    const [result] = await Exam.deleteExam(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Exam not found", 404));
    }

    res.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
};