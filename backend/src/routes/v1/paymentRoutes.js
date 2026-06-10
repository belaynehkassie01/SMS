const express = require("express");

const router = express.Router();

const paymentController =
  require("../../controllers/paymentController");

const verifyToken =
  require("../../middleware/authMiddleware");

const authorizeRoles =
  require("../../middleware/roleMiddleware");

/* =========================
   CREATE PAYMENT
========================= */
router.post(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  paymentController.createPayment
);

/* =========================
   GET ALL PAYMENTS
========================= */
router.get(
  "/",
  verifyToken,
  authorizeRoles("Admin"),
  paymentController.getAllPayments
);

/* =========================
   GET PAYMENT BY ID
========================= */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  paymentController.getPaymentById
);

/* =========================
   UPDATE PAYMENT
========================= */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  paymentController.updatePayment
);

/* =========================
   DELETE PAYMENT
========================= */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("Admin"),
  paymentController.deletePayment
);

module.exports = router;