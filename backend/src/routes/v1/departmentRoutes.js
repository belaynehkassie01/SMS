const express = require("express");

const router = express.Router();

const departmentController =
  require("../../controllers/departmentController");

const verifyToken =
  require("../../middleware/authMiddleware");

const authorizeRoles =
  require("../../middleware/roleMiddleware");

/* =========================
   CREATE DEPARTMENT
========================= */
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  departmentController.createDepartment
);

/* =========================
   GET ALL DEPARTMENTS
========================= */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  departmentController.getAllDepartments
);

/* =========================
   GET DEPARTMENT BY ID
========================= */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin", "Teacher"),
  departmentController.getDepartmentById
);

/* =========================
   UPDATE DEPARTMENT
========================= */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  departmentController.updateDepartment
);

/* =========================
   DELETE DEPARTMENT
========================= */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  departmentController.deleteDepartment
);

module.exports = router;