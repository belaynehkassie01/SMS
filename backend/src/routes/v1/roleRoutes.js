const express = require("express");

const router = express.Router();

const roleController =
  require("../../controllers/roleController");

const verifyToken =
  require("../../middleware/authMiddleware");

const authorizeRoles =
  require("../../middleware/roleMiddleware");

/* =========================
   CREATE ROLE
========================= */
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  roleController.createRole
);

/* =========================
   GET ALL ROLES
========================= */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  roleController.getAllRoles
);

/* =========================
   GET ROLE BY ID
========================= */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  roleController.getRoleById
);

/* =========================
   UPDATE ROLE
========================= */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  roleController.updateRole
);

/* =========================
   DELETE ROLE
========================= */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  roleController.deleteRole
);

module.exports = router;