const AcademicYear = require("../models/academicYearModel");
const AppError = require("../utils/AppError");

/* =========================
   CREATE
========================= */
const createAcademicYear = async (req, res, next) => {
  try {
    await AcademicYear.createAcademicYear(req.body);

    res.status(201).json({
      success: true,
      message: "Academic Year created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL
========================= */
const getAllAcademicYears = async (req, res, next) => {
  try {
    const [rows] = await AcademicYear.getAllAcademicYears();

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
const getAcademicYearById = async (req, res, next) => {
  try {
    const [rows] = await AcademicYear.getAcademicYearById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Academic Year not found", 404));
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
const updateAcademicYear = async (req, res, next) => {
  try {
    const [result] = await AcademicYear.updateAcademicYear(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Academic Year not found", 404));
    }

    res.json({
      success: true,
      message: "Academic Year updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deleteAcademicYear = async (req, res, next) => {
  try {
    const [result] = await AcademicYear.deleteAcademicYear(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Academic Year not found", 404));
    }

    res.json({
      success: true,
      message: "Academic Year deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAcademicYear,
  getAllAcademicYears,
  getAcademicYearById,
  updateAcademicYear,
  deleteAcademicYear,
};