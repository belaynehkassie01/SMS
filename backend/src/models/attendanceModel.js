// models/attendanceModel.js
const db = require("../config/database");

/* =========================
   MARK ATTENDANCE
========================= */
const markAttendance = (data) => {
  const {
    EnrollmentID,
    Date,
    Status,
    CheckInTime,
    CheckOutTime,
    Remarks,
  } = data;

  return db.query(
    `INSERT INTO Attendance
    (
      EnrollmentID,
      Date,
      Status,
      CheckInTime,
      CheckOutTime,
      Remarks,
      CreatedAt,
      UpdatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      EnrollmentID,
      Date,
      Status,
      CheckInTime,
      CheckOutTime,
      Remarks,
    ]
  );
};

/* =========================
   GET ALL ATTENDANCE
========================= */
const getAllAttendance = () => {
  return db.query(`
    SELECT
      a.AttendanceID,
      a.Date,
      a.Status,
      a.CheckInTime,
      a.CheckOutTime,
      a.Remarks,
      a.CreatedAt,
      s.StudentID,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      sec.SectionName,
      sec.SectionID,
      c.Title AS CourseTitle
    FROM Attendance a
    JOIN Enrollment e ON a.EnrollmentID = e.EnrollmentID
    JOIN Student s ON e.StudentID = s.StudentID
    JOIN Person p ON s.PersonID = p.PersonID
    JOIN Section sec ON e.SectionID = sec.SectionID
    JOIN Course c ON sec.CourseID = c.CourseID
    ORDER BY a.Date DESC
  `);
};

/* =========================
   GET ATTENDANCE BY STUDENT ID - NEW METHOD
========================= */
const getAttendanceByStudent = (studentId) => {
  return db.query(`
    SELECT
      a.AttendanceID,
      a.Date,
      a.Status,
      a.CheckInTime,
      a.CheckOutTime,
      a.Remarks,
      a.CreatedAt,
      s.StudentID,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      sec.SectionName,
      sec.SectionID,
      c.Title AS CourseTitle
    FROM Attendance a
    JOIN Enrollment e ON a.EnrollmentID = e.EnrollmentID
    JOIN Student s ON e.StudentID = s.StudentID
    JOIN Person p ON s.PersonID = p.PersonID
    JOIN Section sec ON e.SectionID = sec.SectionID
    JOIN Course c ON sec.CourseID = c.CourseID
    WHERE s.StudentID = ?
    ORDER BY a.Date DESC
  `, [studentId]);
};

/* =========================
   GET BY ID
========================= */
const getAttendanceById = (id) => {
  return db.query(
    `
    SELECT
      a.AttendanceID,
      a.EnrollmentID,
      a.Date,
      a.Status,
      a.CheckInTime,
      a.CheckOutTime,
      a.Remarks,
      a.CreatedAt,
      a.UpdatedAt,
      s.StudentID,
      s.StudentNumber,
      p.FirstName,
      p.LastName,
      sec.SectionName,
      sec.SectionID,
      c.Title AS CourseTitle
    FROM Attendance a
    JOIN Enrollment e ON a.EnrollmentID = e.EnrollmentID
    JOIN Student s ON e.StudentID = s.StudentID
    JOIN Person p ON s.PersonID = p.PersonID
    JOIN Section sec ON e.SectionID = sec.SectionID
    JOIN Course c ON sec.CourseID = c.CourseID
    WHERE a.AttendanceID = ?
    `,
    [id]
  );
};

/* =========================
   UPDATE ATTENDANCE
========================= */
const updateAttendance = (id, data) => {
  const {
    Date,
    Status,
    CheckInTime,
    CheckOutTime,
    Remarks,
  } = data;

  return db.query(
    `
    UPDATE Attendance
    SET
      Date = ?,
      Status = ?,
      CheckInTime = ?,
      CheckOutTime = ?,
      Remarks = ?,
      UpdatedAt = NOW()
    WHERE AttendanceID = ?
    `,
    [
      Date,
      Status,
      CheckInTime,
      CheckOutTime,
      Remarks,
      id,
    ]
  );
};

/* =========================
   DELETE ATTENDANCE
========================= */
const deleteAttendance = (id) => {
  return db.query(
    `
    DELETE FROM Attendance
    WHERE AttendanceID = ?
    `,
    [id]
  );
};

module.exports = {
  markAttendance,
  getAllAttendance,
  getAttendanceByStudent,  // ✅ Export the new method
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};