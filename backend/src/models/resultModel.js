// models/resultModel.js
const db = require("../config/database");

/* =========================
   CREATE RESULT
========================= */
const createResult = (data) => {
  const {
    EnrollmentID,
    ExamID,
    ObtainedMarks,
    Grade,
    Remarks,
  } = data;

  return db.query(
    `INSERT INTO Result
    (
      EnrollmentID,
      ExamID,
      ObtainedMarks,
      Grade,
      Remarks,
      CreatedAt,
      UpdatedAt
    )
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      EnrollmentID,
      ExamID,
      ObtainedMarks,
      Grade,
      Remarks,
    ]
  );
};

/* =========================
   GET ALL RESULTS
========================= */
const getAllResults = () => {
  return db.query(`
    SELECT
      r.ResultID,
      r.ObtainedMarks,
      r.Grade,
      r.Remarks,
      r.CreatedAt,
      e.EnrollmentDate,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      ex.ExamName,
      ex.MaxMarks
    FROM Result r
    LEFT JOIN Enrollment e ON r.EnrollmentID = e.EnrollmentID
    LEFT JOIN Student s ON e.StudentID = s.StudentID
    LEFT JOIN Person p ON s.PersonID = p.PersonID
    LEFT JOIN Exam ex ON r.ExamID = ex.ExamID
    ORDER BY r.ResultID DESC
  `);
};

/* =========================
   GET BY ID (FIXED - with all JOINs)
========================= */
const getResultById = (id) => {
  return db.query(
    `
    SELECT
      r.ResultID,
      r.ObtainedMarks,
      r.Grade,
      r.Remarks,
      r.CreatedAt,
      r.UpdatedAt,
      r.EnrollmentID,
      r.ExamID,
      e.EnrollmentDate,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      ex.ExamName,
      ex.MaxMarks,
      sec.SectionName,
      c.Title as CourseTitle
    FROM Result r
    LEFT JOIN Enrollment e ON r.EnrollmentID = e.EnrollmentID
    LEFT JOIN Student s ON e.StudentID = s.StudentID
    LEFT JOIN Person p ON s.PersonID = p.PersonID
    LEFT JOIN Exam ex ON r.ExamID = ex.ExamID
    LEFT JOIN Section sec ON e.SectionID = sec.SectionID
    LEFT JOIN Course c ON sec.CourseID = c.CourseID
    WHERE r.ResultID = ?
    `,
    [id]
  );
};

/* =========================
   UPDATE RESULT
========================= */
const updateResult = (id, data) => {
  const {
    EnrollmentID,
    ExamID,
    ObtainedMarks,
    Grade,
    Remarks,
  } = data;

  return db.query(
    `
    UPDATE Result
    SET
      EnrollmentID = ?,
      ExamID = ?,
      ObtainedMarks = ?,
      Grade = ?,
      Remarks = ?,
      UpdatedAt = NOW()
    WHERE ResultID = ?
    `,
    [
      EnrollmentID,
      ExamID,
      ObtainedMarks,
      Grade,
      Remarks,
      id,
    ]
  );
};

const getResultsByStudent = (studentId) => {
  console.log('Fetching results for StudentID:', studentId);
  
  return db.query(`
    SELECT
      r.ResultID,
      r.ObtainedMarks,
      r.Grade,
      r.Remarks,
      r.CreatedAt,
      e.EnrollmentDate,
      s.StudentID,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      ex.ExamName,
      ex.MaxMarks,
      c.Title AS CourseTitle
    FROM Result r
    LEFT JOIN Enrollment e ON r.EnrollmentID = e.EnrollmentID
    LEFT JOIN Student s ON e.StudentID = s.StudentID
    LEFT JOIN Person p ON s.PersonID = p.PersonID
    LEFT JOIN Exam ex ON r.ExamID = ex.ExamID
    LEFT JOIN Section sec ON e.SectionID = sec.SectionID
    LEFT JOIN Course c ON sec.CourseID = c.CourseID
    WHERE s.StudentID = ?
    ORDER BY r.ResultID DESC
  `, [studentId]);
};


/* =========================
   DELETE RESULT
========================= */
const deleteResult = (id) => {
  return db.query(
    `
    DELETE FROM Result
    WHERE ResultID = ?
    `,
    [id]
  );
};

module.exports = {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  getResultsByStudent,
  deleteResult,
};