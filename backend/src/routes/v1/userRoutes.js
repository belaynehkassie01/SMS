// routes/v1/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const verifyToken = require("../../middleware/authMiddleware");
const authorizeRoles = require("../../middleware/roleMiddleware");

// All routes require authentication and Admin role
router.use(verifyToken);
router.use(authorizeRoles("Admin"));

// Make sure these specific routes come BEFORE the /:id route
router.get("/persons-without-account", userController.getPersonsWithoutAccount);
router.get("/roles", userController.getRoles);

router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.put("/:id/reset-password", userController.resetPassword);
router.delete("/:id", userController.deleteUser);

module.exports = router;