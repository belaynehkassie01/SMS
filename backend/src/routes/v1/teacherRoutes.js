const express = require("express");
const router = express.Router();

const teacherController = require("../../controllers/teacherController");

const verifyToken = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// CREATE
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  teacherController.createTeacher
);

// GET ALL
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  teacherController.getAllTeachers
);

// GET BY ID
router.get("/:id", verifyToken, teacherController.getTeacherById);

// UPDATE
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  teacherController.updateTeacher
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  teacherController.deleteTeacher
);

module.exports = router;