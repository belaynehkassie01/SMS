const express = require("express");

const router = express.Router();

const resultController =
  require("../../controllers/resultController");

const verifyToken =
  require("../../middleware/authMiddleware");

const authorizeRoles =
  require("../../middleware/roleMiddleware");

/* =========================
   CREATE RESULT
========================= */
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  resultController.createResult
);

/* =========================
   GET ALL RESULTS
========================= */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher", "Student"),
  resultController.getAllResults
);

/* =========================
   GET RESULT BY ID
========================= */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher", "Student"),
  resultController.getResultById
);

/* =========================
   UPDATE RESULT
========================= */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  resultController.updateResult
);

/* =========================
   DELETE RESULT
========================= */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  resultController.deleteResult
);

module.exports = router;