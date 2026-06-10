// backend/src/routes/v1/teachesRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");
const teachesController = require("../../controllers/teachesController");

// GET all teaches
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  teachesController.getAllTeaches
);

// GET teaches by ID - ADD THIS
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  teachesController.getTeachesById
);

// CREATE teaches
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  teachesController.createTeaches
);

// UPDATE teaches
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  teachesController.updateTeaches
);

// DELETE teaches
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  teachesController.deleteTeaches
);

module.exports = router;