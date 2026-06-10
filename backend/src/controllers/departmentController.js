const Department = require("../models/departmentModel");
const AppError = require("../utils/AppError");

/* =========================
   CREATE
========================= */
const createDepartment = async (req, res, next) => {
  try {
    await Department.createDepartment(req.body);

    res.status(201).json({
      success: true,
      message: "Department created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL
========================= */
const getAllDepartments = async (req, res, next) => {
  try {
    const [rows] = await Department.getAllDepartments();

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
const getDepartmentById = async (req, res, next) => {
  try {
    const [rows] = await Department.getDepartmentById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Department not found", 404));
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
const updateDepartment = async (req, res, next) => {
  try {
    const [result] = await Department.updateDepartment(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Department not found", 404));
    }

    res.json({
      success: true,
      message: "Department updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deleteDepartment = async (req, res, next) => {
  try {
    const [result] = await Department.deleteDepartment(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Department not found", 404));
    }

    res.json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};