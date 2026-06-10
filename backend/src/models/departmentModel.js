const db = require("../config/database");

/* =========================
   CREATE DEPARTMENT
========================= */
const createDepartment = (data) => {
  const {
    DeptName,
    HeadOfDept,
    Phone,
    Location,
  } = data;

  return db.query(
    `INSERT INTO Department
    (
      DeptName,
      HeadOfDept,
      Phone,
      Location
    )
    VALUES (?, ?, ?, ?)`,
    [
      DeptName,
      HeadOfDept,
      Phone,
      Location,
    ]
  );
};

/* =========================
   GET ALL
========================= */
const getAllDepartments = () => {
  return db.query(`
    SELECT *
    FROM Department
  `);
};

/* =========================
   GET BY ID
========================= */
const getDepartmentById = (id) => {
  return db.query(
    `
    SELECT *
    FROM Department
    WHERE DeptID = ?
    `,
    [id]
  );
};

/* =========================
   UPDATE
========================= */
const updateDepartment = (id, data) => {
  const {
    DeptName,
    HeadOfDept,
    Phone,
    Location,
    IsActive,
  } = data;

  return db.query(
    `
    UPDATE Department
    SET
      DeptName = ?,
      HeadOfDept = ?,
      Phone = ?,
      Location = ?,
      IsActive = ?
    WHERE DeptID = ?
    `,
    [
      DeptName,
      HeadOfDept,
      Phone,
      Location,
      IsActive,
      id,
    ]
  );
};

/* =========================
   DELETE
========================= */
const deleteDepartment = (id) => {
  return db.query(
    `
    DELETE FROM Department
    WHERE DeptID = ?
    `,
    [id]
  );
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};