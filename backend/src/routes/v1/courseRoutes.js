const express = require("express");

const router = express.Router();

const courseController = require("../../controllers/courseController");

const verifyToken = require("../../middleware/authMiddleware");

const authorizeRoles = require("../../middleware/roleMiddleware");

// CREATE - Admin only
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  courseController.createCourse
);

// GET ALL - Admin, Teacher, and Student can view courses
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher", "Student"),  // ✅ Added Student
  courseController.getAllCourses
);

// GET ONE - Admin, Teacher, and Student can view course details
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher", "Student"),  // ✅ Added Student (and fixed missing role check)
  courseController.getCourseById
);

// UPDATE - Admin only
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  courseController.updateCourse
);

// DELETE - Admin only
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  courseController.deleteCourse
);

module.exports = router;