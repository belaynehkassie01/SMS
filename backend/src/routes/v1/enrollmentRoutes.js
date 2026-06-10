const express = require("express");

const router = express.Router();
const {
  createEnrollmentValidator,
  updateEnrollmentValidator
} = require("../../validators/enrollmentValidator");

const { validateLogin } = require("../../validators/authValidator");
const validate = require("../../middleware/validateMiddleware");
const enrollmentController =
  require("../../controllers/enrollmentController");

const verifyToken =
  require("../../middleware/authMiddleware");

const authorizeRoles =
  require("../../middleware/roleMiddleware");

/* =========================
   CREATE ENROLLMENT
========================= */
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  createEnrollmentValidator,
  validate,
  enrollmentController.createEnrollment
);

/* =========================
   GET ALL ENROLLMENTS
========================= */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher", "Student"),
  enrollmentController.getAllEnrollments
);

/* =========================
   GET ENROLLMENT BY ID
========================= */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher", "Student"),
  enrollmentController.getEnrollmentById
);

/* =========================
   UPDATE ENROLLMENT
========================= */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  updateEnrollmentValidator,
  validate,
  enrollmentController.updateEnrollment
);

/* =========================
   DELETE ENROLLMENT
========================= */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  enrollmentController.deleteEnrollment
);

module.exports = router;