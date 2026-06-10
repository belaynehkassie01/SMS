const db = require("../config/database");

/* =========================
   CREATE ROLE
========================= */
const createRole = (data) => {
  const {
    RoleName,
    Description,
    RoleLevel,
  } = data;

  return db.query(
    `INSERT INTO Role
    (
      RoleName,
      Description,
      RoleLevel,
      CreatedAt
    )
    VALUES (?, ?, ?, NOW())`,
    [
      RoleName,
      Description,
      RoleLevel,
    ]
  );
};

/* =========================
   GET ALL ROLES
========================= */
const getAllRoles = () => {
  return db.query(`
    SELECT *
    FROM Role
  `);
};

/* =========================
   GET ROLE BY ID
========================= */
const getRoleById = (id) => {
  return db.query(
    `
    SELECT *
    FROM Role
    WHERE RoleID = ?
    `,
    [id]
  );
};

/* =========================
   UPDATE ROLE
========================= */
const updateRole = (id, data) => {
  const {
    RoleName,
    Description,
    RoleLevel,
  } = data;

  return db.query(
    `
    UPDATE Role
    SET
      RoleName = ?,
      Description = ?,
      RoleLevel = ?
    WHERE RoleID = ?
    `,
    [
      RoleName,
      Description,
      RoleLevel,
      id,
    ]
  );
};

/* =========================
   DELETE ROLE
========================= */
const deleteRole = (id) => {
  return db.query(
    `
    DELETE FROM Role
    WHERE RoleID = ?
    `,
    [id]
  );
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};