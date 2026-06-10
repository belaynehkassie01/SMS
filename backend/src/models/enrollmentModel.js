const db = require("../config/database");

/* =========================
   CREATE ENROLLMENT
========================= */
const createEnrollment = (data) => {
  const {
    StudentID,
    SectionID,
    EnrollmentDate,
    Status,
  } = data;

  return db.query(
    `INSERT INTO Enrollment
    (StudentID, SectionID, EnrollmentDate, Status)
    VALUES (?, ?, ?, ?)`,
    [
      StudentID,
      SectionID,
      EnrollmentDate,
      Status,
    ]
  );
};

/* =========================
   GET ALL ENROLLMENTS
========================= */
const getAllEnrollments = () => {
  return db.query(`
    SELECT
      e.EnrollmentID,
      e.EnrollmentDate,
      e.Status,
      s.StudentID,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      sec.SectionID,
      sec.SectionName,
      c.CourseID,
      c.Title AS CourseTitle
    FROM Enrollment e
    JOIN Student s ON e.StudentID = s.StudentID
    JOIN Person p ON s.PersonID = p.PersonID
    JOIN Section sec ON e.SectionID = sec.SectionID
    JOIN Course c ON sec.CourseID = c.CourseID
  `);
};


/* =========================
   GET ENROLLMENTS BY STUDENT ID
========================= */
const getEnrollmentsByStudent = (studentId) => {
  console.log('Fetching enrollments for student:', studentId);
  
  return db.query(`
    SELECT
      e.EnrollmentID,
      e.EnrollmentDate,
      e.Status,
      s.StudentID,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      sec.SectionID,
      sec.SectionName,
      c.CourseID,
      c.Title AS CourseTitle
    FROM Enrollment e
    JOIN Student s ON e.StudentID = s.StudentID
    JOIN Person p ON s.PersonID = p.PersonID
    JOIN Section sec ON e.SectionID = sec.SectionID
    JOIN Course c ON sec.CourseID = c.CourseID
    WHERE e.StudentID = ?
  `, [studentId]);
};

/* =========================
   GET BY ID
========================= */
const getEnrollmentById = (id) => {
  return db.query(`
    SELECT
      e.*,
      s.StudentID,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      sec.SectionName,
      c.Title AS CourseTitle
    FROM Enrollment e
    JOIN Student s ON e.StudentID = s.StudentID
    JOIN Person p ON s.PersonID = p.PersonID
    JOIN Section sec ON e.SectionID = sec.SectionID
    JOIN Course c ON sec.CourseID = c.CourseID
    WHERE e.EnrollmentID = ?
  `, [id]);
};

/* =========================
   UPDATE ENROLLMENT
========================= */
const updateEnrollment = (id, data) => {
  const {
    StudentID,
    SectionID,
    EnrollmentDate,
    Status,
    DropDate,
    DropReason,
  } = data;

  return db.query(
    `UPDATE Enrollment
     SET
       StudentID = ?,
       SectionID = ?,
       EnrollmentDate = ?,
       Status = ?,
       DropDate = ?,
       DropReason = ?
     WHERE EnrollmentID = ?`,
    [
      StudentID,
      SectionID,
      EnrollmentDate,
      Status,
      DropDate || null,
      DropReason || null,
      id,
    ]
  );
};

/* =========================
   DELETE
========================= */
const deleteEnrollment = (id) => {
  return db.query(
    `DELETE FROM Enrollment WHERE EnrollmentID = ?`,
    [id]
  );
};

/* =========================
   BUSINESS HELPERS
========================= */
const checkDuplicate = (StudentID, SectionID) => {
  return db.query(
    `SELECT * FROM Enrollment
     WHERE StudentID = ? AND SectionID = ?`,
    [StudentID, SectionID]
  );
};

const countBySection = (SectionID) => {
  return db.query(
    `SELECT COUNT(*) AS total
     FROM Enrollment
     WHERE SectionID = ?`,
    [SectionID]
  );
};

const getSectionCapacity = (SectionID) => {
  return db.query(
    `SELECT Capacity FROM Section WHERE SectionID = ?`,
    [SectionID]
  );
};

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentsByStudent,  // ✅ Export the new method
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
  checkDuplicate,
  countBySection,
  getSectionCapacity,
};