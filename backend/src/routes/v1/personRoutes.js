const express = require("express");

const router = express.Router();

const personController =
  require("../../controllers/personController");

const verifyToken =
  require("../../middleware/authMiddleware");

const authorizeRoles =
  require("../../middleware/roleMiddleware");

/* =========================
   CREATE PERSON
========================= */
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  personController.createPerson
);

/* =========================
   GET ALL PERSONS
========================= */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  personController.getAllPersons
);

/* =========================
   GET PERSON BY ID
========================= */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin",),
  personController.getPersonById
);

/* =========================
   UPDATE PERSON
========================= */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  personController.updatePerson
);

/* =========================
   DELETE PERSON
========================= */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  personController.deletePerson
);

module.exports = router;