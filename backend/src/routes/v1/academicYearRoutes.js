const express = require("express");

const router = express.Router();

const academicYearController =
  require("../../controllers/academicYearController");

const verifyToken =
  require("../../middleware/authMiddleware");

const authorizeRoles =
  require("../../middleware/roleMiddleware");

/* =========================
   CREATE
========================= */
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  academicYearController.createAcademicYear
);

/* =========================
   GET ALL
========================= */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  academicYearController.getAllAcademicYears
);

/* =========================
   GET BY ID
========================= */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  academicYearController.getAcademicYearById
);

/* =========================
   UPDATE
========================= */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  academicYearController.updateAcademicYear
);

/* =========================
   DELETE
========================= */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  academicYearController.deleteAcademicYear
);

module.exports = router;