// backend/models/sectionModel.js
const db = require("../config/database");

// GET ALL SECTIONS with Course and Academic Year info
const getAllSections = () => {
  return db.query(
    `SELECT 
      s.SectionID,
      s.SectionName,
      c.Title as CourseTitle,
      ay.Year,
      ay.Semester,
      s.RoomNumber,
      s.Schedule,
      s.Capacity,
      s.IsActive
    FROM Section s
    LEFT JOIN Course c ON s.CourseID = c.CourseID
    LEFT JOIN AcademicYear ay ON s.AcademicYearID = ay.AcademicYearID
    ORDER BY s.SectionID DESC`
  );
};

// GET SECTION BY ID with Course and Academic Year info
const getSectionById = (id) => {
  return db.query(
    `SELECT 
      s.SectionID,
      s.SectionName,
      s.CourseID,
      c.Title as CourseTitle,
      s.AcademicYearID,
      ay.Year,
      ay.Semester,
      s.RoomNumber,
      s.Schedule,
      s.Capacity,
      s.IsActive,
      s.CreatedAt,
      s.UpdatedAt
    FROM Section s
    LEFT JOIN Course c ON s.CourseID = c.CourseID
    LEFT JOIN AcademicYear ay ON s.AcademicYearID = ay.AcademicYearID
    WHERE s.SectionID = ?`,
    [id]
  );
};

// CREATE SECTION
const createSection = (data) => {
  const {
    SectionName,
    CourseID,
    AcademicYearID,
    RoomNumber,
    Schedule,
    Capacity,
  } = data;

  return db.query(
    `INSERT INTO Section 
    (SectionName, CourseID, AcademicYearID, RoomNumber, Schedule, Capacity, IsActive)
    VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [SectionName, CourseID, AcademicYearID, RoomNumber, Schedule, Capacity]
  );
};

// UPDATE SECTION
const updateSection = (id, data) => {
  const {
    SectionName,
    CourseID,
    AcademicYearID,
    RoomNumber,
    Schedule,
    Capacity,
  } = data;

  return db.query(
    `UPDATE Section SET 
      SectionName = ?,
      CourseID = ?,
      AcademicYearID = ?,
      RoomNumber = ?,
      Schedule = ?,
      Capacity = ?
    WHERE SectionID = ?`,
    [SectionName, CourseID, AcademicYearID, RoomNumber, Schedule, Capacity, id]
  );
};

// DELETE SECTION
const deleteSection = (id) => {
  return db.query(`DELETE FROM Section WHERE SectionID = ?`, [id]);
};

module.exports = {
  getAllSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,
};