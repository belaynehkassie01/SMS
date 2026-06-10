const express = require("express");

const router = express.Router();

const sectionController = require("../../controllers/sectionController");

const verifyToken = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// CREATE
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  sectionController.createSection
);

// GET ALL
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  sectionController.getAllSections
);

// GET BY ID
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  sectionController.getSectionById
);

// UPDATE
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  sectionController.updateSection
);

// DELETE
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  sectionController.deleteSection
);

module.exports = router;