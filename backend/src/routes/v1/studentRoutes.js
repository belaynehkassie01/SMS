const express = require("express");
const router = express.Router();

const studentController = require("../../controllers/studentController");

const verifyToken = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

const {
  createStudentValidator,
  updateStudentValidator
} = require("../../validators/studentValidator");

const validate = require("../../middleware/validateMiddleware");

// CREATE STUDENT (Admin only)
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  createStudentValidator,
  validate,
  studentController.createStudent
);

// GET ALL STUDENTS (Admin + Teacher)
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  studentController.getAllStudents
);

// GET STUDENT BY ID
router.get(
  "/:id",
  verifyToken,
  studentController.getStudentById
);

// UPDATE STUDENT
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  updateStudentValidator,
  validate,
  studentController.updateStudent
);

// DELETE STUDENT
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  studentController.deleteStudent
);

module.exports = router;