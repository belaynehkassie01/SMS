// controllers/userController.js
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await User.getAllUsers();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get all users error:", error);
    next(error);
  }
};

// Get user by ID
const getUserById = async (req, res, next) => {
  try {
    const [rows] = await User.getUserById(req.params.id);
    if (rows.length === 0) {
      return next(new AppError("User not found", 404));
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Get user by ID error:", error);
    next(error);
  }
};

// Get persons without user accounts
const getPersonsWithoutAccount = async (req, res, next) => {
  try {
    const [rows] = await User.getPersonsWithoutAccount();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get persons without account error:", error);
    next(error);
  }
};

// Get roles
const getRoles = async (req, res, next) => {
  try {
    const [rows] = await User.getRoles();
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get roles error:", error);
    next(error);
  }
};

// Create user
const createUser = async (req, res, next) => {
  try {
    const { Username, Password, PersonID, RoleID, IsActive } = req.body;

    // Validate required fields
    if (!Username || !Password || !PersonID || !RoleID) {
      return next(new AppError("Username, Password, PersonID, and RoleID are required", 400));
    }

    // Check if username exists
    const exists = await User.usernameExists(Username);
    if (exists) {
      return next(new AppError("Username already exists", 400));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create user
    await User.createUser({
      Username,
      PasswordHash: hashedPassword,
      PersonID,
      RoleID,
      IsActive: IsActive !== undefined ? IsActive : 1,
    });

    res.status(201).json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.error("Create user error:", error);
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Username, RoleID, IsActive } = req.body;

    const [existing] = await User.getUserById(id);
    if (existing.length === 0) {
      return next(new AppError("User not found", 404));
    }

    // Check if username exists (excluding current user)
    const exists = await User.usernameExists(Username, id);
    if (exists) {
      return next(new AppError("Username already exists", 400));
    }

    await User.updateUser(id, { Username, RoleID, IsActive });
    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    next(error);
  }
};

// Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { NewPassword } = req.body;

    const [existing] = await User.getUserById(id);
    if (existing.length === 0) {
      return next(new AppError("User not found", 404));
    }

    const hashedPassword = await bcrypt.hash(NewPassword, 10);
    await User.updatePassword(id, hashedPassword);

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await User.deleteUser(id);
    if (result.affectedRows === 0) {
      return next(new AppError("User not found", 404));
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getPersonsWithoutAccount,
  getRoles,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
};