const db = require("../config/database");

/* =========================
   CREATE ACADEMIC YEAR
========================= */
const createAcademicYear = (data) => {
  const {
    Year,
    Semester,
    StartDate,
    EndDate,
    IsActive,
  } = data;

  return db.query(
    `INSERT INTO AcademicYear
    (
      Year,
      Semester,
      StartDate,
      EndDate,
      IsActive
    )
    VALUES (?, ?, ?, ?, ?)`,
    [
      Year,
      Semester,
      StartDate,
      EndDate,
      IsActive,
    ]
  );
};

/* =========================
   GET ALL
========================= */
const getAllAcademicYears = () => {
  return db.query(`
    SELECT *
    FROM AcademicYear
  `);
};

/* =========================
   GET BY ID
========================= */
const getAcademicYearById = (id) => {
  return db.query(
    `
    SELECT *
    FROM AcademicYear
    WHERE AcademicYearID = ?
    `,
    [id]
  );
};

/* =========================
   UPDATE
========================= */
const updateAcademicYear = (id, data) => {
  const {
    Year,
    Semester,
    StartDate,
    EndDate,
    IsActive,
  } = data;

  return db.query(
    `
    UPDATE AcademicYear
    SET
      Year = ?,
      Semester = ?,
      StartDate = ?,
      EndDate = ?,
      IsActive = ?
    WHERE AcademicYearID = ?
    `,
    [
      Year,
      Semester,
      StartDate,
      EndDate,
      IsActive,
      id,
    ]
  );
};

/* =========================
   DELETE
========================= */
const deleteAcademicYear = (id) => {
  return db.query(
    `
    DELETE FROM AcademicYear
    WHERE AcademicYearID = ?
    `,
    [id]
  );
};

module.exports = {
  createAcademicYear,
  getAllAcademicYears,
  getAcademicYearById,
  updateAcademicYear,
  deleteAcademicYear,
};