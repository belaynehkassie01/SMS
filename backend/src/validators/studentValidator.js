// validators/studentValidator.js
const { body } = require("express-validator");

const createStudentValidator = [
  // ✅ REMOVED PersonID validation (model auto-creates Person)

  body("StudentNumber")
    .notEmpty()
    .withMessage("Student number is required"),

  body("FirstName")
    .notEmpty()
    .withMessage("First name is required"),

  body("LastName")
    .notEmpty()
    .withMessage("Last name is required"),

  // ✅ DepartmentID is now optional
  body("DepartmentID")
    .optional()
    .isInt()
    .withMessage("DepartmentID must be integer"),

  // ✅ SectionID is optional
  body("SectionID")
    .optional()
    .isInt()
    .withMessage("SectionID must be integer"),

  // ✅ EnrollmentDate is now optional
  body("EnrollmentDate")
    .optional()
    .isDate()
    .withMessage("Invalid date"),

  // ✅ Status has default 'Active' in model
  body("Status")
    .optional(),

  // Optional fields
  body("Email")
    .optional()
    .isEmail()
    .withMessage("Invalid email"),

  body("Phone")
    .optional(),

  body("Address")
    .optional(),

  body("Gender")
    .optional(),

  body("BirthDate")
    .optional()
    .isDate()
    .withMessage("Invalid birth date"),

  body("GuardianName")
    .optional(),

  body("GuardianPhone")
    .optional(),

  body("GuardianEmail")
    .optional()
    .isEmail()
    .withMessage("Invalid guardian email"),
];

const updateStudentValidator = [
  body("StudentNumber")
    .optional(),

  body("FirstName")
    .optional(),

  body("LastName")
    .optional(),

  body("DepartmentID")
    .optional()
    .isInt()
    .withMessage("DepartmentID must be integer"),

  body("SectionID")
    .optional()
    .isInt()
    .withMessage("SectionID must be integer"),

  body("EnrollmentDate")
    .optional()
    .isDate()
    .withMessage("Invalid date"),

  body("Status")
    .optional(),

  body("Email")
    .optional()
    .isEmail()
    .withMessage("Invalid email"),

  body("Phone")
    .optional(),

  body("Address")
    .optional(),

  body("Gender")
    .optional(),

  body("BirthDate")
    .optional()
    .isDate()
    .withMessage("Invalid birth date"),

  body("GuardianName")
    .optional(),

  body("GuardianPhone")
    .optional(),

  body("GuardianEmail")
    .optional()
    .isEmail()
    .withMessage("Invalid guardian email"),
];

module.exports = {
  createStudentValidator,
  updateStudentValidator,
};