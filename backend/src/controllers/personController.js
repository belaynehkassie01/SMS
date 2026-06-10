const Person = require("../models/personModel");
const AppError = require("../utils/AppError");

/* =========================
   CREATE
========================= */
const createPerson = async (req, res, next) => {
  try {
    const [result] = await Person.createPerson(req.body);

    res.status(201).json({
      success: true,
      message: "Person created successfully",
      data: { PersonID: result.insertId }  // ✅ ADD THIS - Return the new PersonID
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL
========================= */
const getAllPersons = async (req, res, next) => {
  try {
    const [rows] = await Person.getAllPersons();

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
const getPersonById = async (req, res, next) => {
  try {
    const [rows] = await Person.getPersonById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Person not found", 404));
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
const updatePerson = async (req, res, next) => {
  try {
    const [result] = await Person.updatePerson(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Person not found", 404));
    }

    res.json({
      success: true,
      message: "Person updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deletePerson = async (req, res, next) => {
  try {
    const [result] = await Person.deletePerson(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Person not found", 404));
    }

    res.json({
      success: true,
      message: "Person deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPerson,
  getAllPersons,
  getPersonById,
  updatePerson,
  deletePerson,
};