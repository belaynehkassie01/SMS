const express = require("express");
const router = express.Router();

const { login } = require("../../controllers/authController");
const verifyToken = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");
const { validateLogin } = require("../../validators/authValidator");

const authController = require("../../controllers/authController");

// LOGIN ROUTE
router.post(
  "/login",
  validateLogin,
  authController.login
);


// PROTECTED PROFILE ROUTE
router.get(
  "/profile",
  verifyToken,
  (req, res) => {
    res.json({
      success: true,
      message: "Protected route accessed",
      user: req.user,
    });
  }
);


// ADMIN ONLY ROUTE
router.get(
  "/admin-only",
  verifyToken,
  authorizeRoles("Admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
    });
  }
);

module.exports = router;