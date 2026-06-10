const Role = require("../models/roleModel");
const AppError = require("../utils/AppError");

/* =========================
   CREATE
========================= */
const createRole = async (req, res, next) => {
  try {
    await Role.createRole(req.body);

    res.status(201).json({
      success: true,
      message: "Role created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL
========================= */
const getAllRoles = async (req, res, next) => {
  try {
    const [rows] = await Role.getAllRoles();

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
const getRoleById = async (req, res, next) => {
  try {
    const [rows] = await Role.getRoleById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Role not found", 404));
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
const updateRole = async (req, res, next) => {
  try {
    const [result] = await Role.updateRole(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Role not found", 404));
    }

    res.json({
      success: true,
      message: "Role updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deleteRole = async (req, res, next) => {
  try {
    const [result] = await Role.deleteRole(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Role not found", 404));
    }

    res.json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};