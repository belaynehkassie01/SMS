const db = require("../config/database");

/* =========================
   CREATE EXAM
========================= */
const createExam = (data) => {
  const {
    SectionID,
    ExamName,
    ExamDate,
    MaxMarks,
    Weightage,
  } = data;

  return db.query(
    `INSERT INTO Exam
    (
      SectionID,
      ExamName,
      ExamDate,
      MaxMarks,
      Weightage
    )
    VALUES (?, ?, ?, ?, ?)`,
    [
      SectionID,
      ExamName,
      ExamDate,
      MaxMarks,
      Weightage,
    ]
  );
};

/* =========================
   GET ALL EXAMS
========================= */
const getAllExams = () => {
  return db.query(`
    SELECT
      e.ExamID,
      e.ExamName,
      e.ExamDate,
      e.MaxMarks,
      e.Weightage,
      e.SectionID,
      s.SectionName,
      c.Title AS CourseTitle,
      c.CourseID,
      e.CreatedAt,
      e.UpdatedAt
    FROM Exam e
    LEFT JOIN Section s ON e.SectionID = s.SectionID
    LEFT JOIN Course c ON s.CourseID = c.CourseID
    ORDER BY e.ExamID DESC
  `);
};

/* =========================
   GET BY ID - FIXED
========================= */
const getExamById = (id) => {
  return db.query(
    `
    SELECT 
      e.ExamID,
      e.ExamName,
      e.ExamDate,
      e.MaxMarks,
      e.Weightage,
      e.SectionID,
      s.SectionName,
      c.Title AS CourseTitle,
      c.CourseID,
      e.CreatedAt,
      e.UpdatedAt
    FROM Exam e
    LEFT JOIN Section s ON e.SectionID = s.SectionID
    LEFT JOIN Course c ON s.CourseID = c.CourseID
    WHERE e.ExamID = ?
    `,
    [id]
  );
};

/* =========================
   UPDATE EXAM
========================= */
const updateExam = (id, data) => {
  const {
    SectionID,
    ExamName,
    ExamDate,
    MaxMarks,
    Weightage,
  } = data;

  return db.query(
    `
    UPDATE Exam
    SET
      SectionID = ?,
      ExamName = ?,
      ExamDate = ?,
      MaxMarks = ?,
      Weightage = ?
    WHERE ExamID = ?
    `,
    [
      SectionID,
      ExamName,
      ExamDate,
      MaxMarks,
      Weightage,
      id,
    ]
  );
};

/* =========================
   DELETE EXAM
========================= */
const deleteExam = (id) => {
  return db.query(
    `
    DELETE FROM Exam
    WHERE ExamID = ?
    `,
    [id]
  );
};

module.exports = {
  createExam,
  getAllExams,
  getExamById,
  updateExam,
  deleteExam,
};