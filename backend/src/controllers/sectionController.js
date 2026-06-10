const Section = require("../models/sectionModel");
const AppError = require("../utils/AppError");

// CREATE
const createSection = async (req, res, next) => {
  try {
    await Section.createSection(req.body);

    res.status(201).json({
      success: true,
      message: "Section created successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL
const getAllSections = async (req, res, next) => {
  try {
    const [rows] = await Section.getAllSections();

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// GET BY ID
const getSectionById = async (req, res, next) => {
  try {
    const [rows] = await Section.getSectionById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Section not found", 404));
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
const updateSection = async (req, res, next) => {
  try {
    const [result] = await Section.updateSection(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Section not found", 404));
    }

    res.json({
      success: true,
      message: "Section updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE
const deleteSection = async (req, res, next) => {
  try {
    const [result] = await Section.deleteSection(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Section not found", 404));
    }

    res.json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSection,
  getAllSections,
  getSectionById,
  updateSection,
  deleteSection,
};