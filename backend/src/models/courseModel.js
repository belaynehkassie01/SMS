// models/courseModel.js
const db = require("../config/database");

// CREATE COURSE
const createCourse = async (data) => {
  const {
    CourseCode,
    Title,
    Credits,
    Description,
    DeptID,
  } = data;

  return db.query(
    `INSERT INTO Course
    (CourseCode, Title, Credits, Description, DeptID)
    VALUES (?, ?, ?, ?, ?)`,
    [
      CourseCode,
      Title,
      Credits,
      Description,
      DeptID,
    ]
  );
};

// GET ALL COURSES
const getAllCourses = () => {
  return db.query(`
    SELECT
      c.CourseID,
      c.CourseCode,
      c.Title,
      c.Credits,
      c.Description,
      c.DeptID,
      d.DeptName
    FROM Course c
    LEFT JOIN Department d ON c.DeptID = d.DeptID
  `);
};

// GET BY ID (FIXED - includes Department name)
const getCourseById = (id) => {
  return db.query(
    `SELECT
      c.CourseID,
      c.CourseCode,
      c.Title,
      c.Credits,
      c.Description,
      c.DeptID,
      d.DeptName
    FROM Course c
    LEFT JOIN Department d ON c.DeptID = d.DeptID
    WHERE c.CourseID = ?`,
    [id]
  );
};

// UPDATE
const updateCourse = (id, data) => {
  const {
    CourseCode,
    Title,
    Credits,
    Description,
    DeptID,
  } = data;

  return db.query(
    `UPDATE Course SET
      CourseCode = ?,
      Title = ?,
      Credits = ?,
      Description = ?,
      DeptID = ?
     WHERE CourseID = ?`,
    [
      CourseCode,
      Title,
      Credits,
      Description,
      DeptID,
      id,
    ]
  );
};

// DELETE
const deleteCourse = (id) => {
  return db.query(
    `DELETE FROM Course WHERE CourseID = ?`,
    [id]
  );
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};