const express = require("express");

const router = express.Router();

const examController =
  require("../../controllers/examController");

const verifyToken =
  require("../../middleware/authMiddleware");

const authorizeRoles =
  require("../../middleware/roleMiddleware");

/* =========================
   CREATE EXAM
========================= */
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"), // ✅ Add Teacher
  examController.createExam
);

/* =========================
   GET ALL EXAMS
========================= */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  examController.getAllExams
);

/* =========================
   GET EXAM BY ID
========================= */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  examController.getExamById
);

/* =========================
   UPDATE EXAM
========================= */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher"), // ✅ Add Teacher
  examController.updateExam
);

/* =========================
   DELETE EXAM
========================= */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"), // Admin only for delete
  examController.deleteExam
);

module.exports = router;