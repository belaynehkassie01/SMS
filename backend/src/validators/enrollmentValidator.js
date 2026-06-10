const { body, param } = require("express-validator");

/* =========================
   CREATE VALIDATION
========================= */
const createEnrollmentValidator = [
  body("StudentID").isInt().withMessage("StudentID required"),
  body("SectionID").isInt().withMessage("SectionID required"),
  body("EnrollmentDate").notEmpty().withMessage("EnrollmentDate required"),
];

/* =========================
   UPDATE VALIDATION
========================= */
const updateEnrollmentValidator = [
  param("id").isInt().withMessage("Invalid Enrollment ID"),

  body("StudentID").optional().isInt(),
  body("SectionID").optional().isInt(),
  body("Status").optional().isString(),
];

module.exports = {
  createEnrollmentValidator,
  updateEnrollmentValidator,
};