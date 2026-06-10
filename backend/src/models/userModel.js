// models/userModel.js
const db = require("../config/database");
const bcrypt = require("bcryptjs");

// Get all users with Person and Role info
const getAllUsers = () => {
  return db.query(`
    SELECT 
      u.UserID,
      u.Username,
      u.IsActive,
      u.CreatedAt,
      u.UpdatedAt,
      u.PersonID,
      u.RoleID,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      r.RoleName
    FROM UserAccount u
    LEFT JOIN Person p ON u.PersonID = p.PersonID
    LEFT JOIN Role r ON u.RoleID = r.RoleID
    ORDER BY u.UserID DESC
  `);
};

// Get user by ID
const getUserById = (id) => {
  return db.query(`
    SELECT 
      u.UserID,
      u.Username,
      u.IsActive,
      u.LastLogin,
      u.CreatedAt,
      u.UpdatedAt,
      u.PersonID,
      u.RoleID,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Gender,
      p.BirthDate,
      p.Address,
      r.RoleName
    FROM UserAccount u
    LEFT JOIN Person p ON u.PersonID = p.PersonID
    LEFT JOIN Role r ON u.RoleID = r.RoleID
    WHERE u.UserID = ?
  `, [id]);
};

// Get persons without user accounts (for dropdown)
const getPersonsWithoutAccount = () => {
  return db.query(`
    SELECT 
      p.PersonID,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone
    FROM Person p
    LEFT JOIN UserAccount u ON p.PersonID = u.PersonID
    WHERE u.UserID IS NULL
    ORDER BY p.PersonID ASC
  `);
};

// Get roles
const getRoles = () => {
  return db.query(`
    SELECT RoleID, RoleName, RoleLevel
    FROM Role
    ORDER BY RoleLevel ASC
  `);
};

// Create user account
const createUser = (data) => {
  const { Username, PasswordHash, PersonID, RoleID, IsActive } = data;
  return db.query(
    `INSERT INTO UserAccount (Username, PasswordHash, PersonID, RoleID, IsActive, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [Username, PasswordHash, PersonID, RoleID, IsActive !== undefined ? IsActive : 1]
  );
};

// Update user
const updateUser = (id, data) => {
  const { Username, RoleID, IsActive } = data;
  return db.query(
    `UPDATE UserAccount 
     SET Username = ?, RoleID = ?, IsActive = ?, UpdatedAt = NOW()
     WHERE UserID = ?`,
    [Username, RoleID, IsActive, id]
  );
};

// Update password
const updatePassword = (id, PasswordHash) => {
  return db.query(
    `UPDATE UserAccount SET PasswordHash = ?, UpdatedAt = NOW() WHERE UserID = ?`,
    [PasswordHash, id]
  );
};

// Delete user
const deleteUser = (id) => {
  return db.query(`DELETE FROM UserAccount WHERE UserID = ?`, [id]);
};

// Check if username exists
const usernameExists = async (username, excludeId = null) => {
  let query = `SELECT UserID FROM UserAccount WHERE Username = ?`;
  let params = [username];
  
  if (excludeId) {
    query += ` AND UserID != ?`;
    params.push(excludeId);
  }
  
  const [rows] = await db.query(query, params);
  return rows.length > 0;
};

module.exports = {
  getAllUsers,
  getUserById,
  getPersonsWithoutAccount,
  getRoles,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
  usernameExists,
};