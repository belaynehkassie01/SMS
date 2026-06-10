// backend/src/models/teachesModel.js
const db = require("../config/database");

// Get all teaches with teacher, course, section details
const getAllTeaches = () => {
  return db.query(`
    SELECT 
      t.TeachesID,
      t.TeacherID,
      t.SectionID,
      t.CourseID,
      t.IsPrimaryTeacher,
      t.CreatedAt,
      t.UpdatedAt,
      p.FirstName,
      p.LastName,
      c.Title AS CourseTitle,
      s.SectionName
    FROM Teaches t
    JOIN Teacher tr ON t.TeacherID = tr.TeacherID
    JOIN Person p ON tr.PersonID = p.PersonID
    JOIN Course c ON t.CourseID = c.CourseID
    JOIN Section s ON t.SectionID = s.SectionID
    ORDER BY t.TeachesID DESC
  `);
};

// Get teaches by ID - ADD THIS FUNCTION
const getTeachesById = (id) => {
  return db.query(`
    SELECT 
      t.TeachesID,
      t.TeacherID,
      t.SectionID,
      t.CourseID,
      t.IsPrimaryTeacher,
      t.CreatedAt,
      t.UpdatedAt,
      p.FirstName,
      p.LastName,
      c.Title AS CourseTitle,
      s.SectionName
    FROM Teaches t
    JOIN Teacher tr ON t.TeacherID = tr.TeacherID
    JOIN Person p ON tr.PersonID = p.PersonID
    JOIN Course c ON t.CourseID = c.CourseID
    JOIN Section s ON t.SectionID = s.SectionID
    WHERE t.TeachesID = ?
  `, [id]);
};

// Create teaches
const createTeaches = (data) => {
  const { TeacherID, SectionID, CourseID, IsPrimaryTeacher } = data;
  return db.query(
    `INSERT INTO Teaches (TeacherID, SectionID, CourseID, IsPrimaryTeacher, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, NOW(), NOW())`,
    [TeacherID, SectionID, CourseID, IsPrimaryTeacher]
  );
};

// Update teaches
const updateTeaches = (id, data) => {
  const { TeacherID, SectionID, CourseID, IsPrimaryTeacher } = data;
  return db.query(
    `UPDATE Teaches 
     SET TeacherID = ?, SectionID = ?, CourseID = ?, IsPrimaryTeacher = ?, UpdatedAt = NOW()
     WHERE TeachesID = ?`,
    [TeacherID, SectionID, CourseID, IsPrimaryTeacher, id]
  );
};

// Delete teaches
const deleteTeaches = (id) => {
  return db.query(`DELETE FROM Teaches WHERE TeachesID = ?`, [id]);
};

// Check duplicate
const checkDuplicate = (TeacherID, SectionID) => {
  return db.query(
    `SELECT * FROM Teaches WHERE TeacherID = ? AND SectionID = ?`,
    [TeacherID, SectionID]
  );
};

module.exports = {
  getAllTeaches,
  getTeachesById,
  createTeaches,
  updateTeaches,
  deleteTeaches,
  checkDuplicate,
};