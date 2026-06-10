const Payment = require("../models/paymentModel");
const AppError = require("../utils/AppError");

/* =========================
   CREATE
========================= */
const createPayment = async (req, res, next) => {
  try {
    await Payment.createPayment(req.body);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL
========================= */
const getAllPayments = async (req, res, next) => {
  try {
    const [rows] = await Payment.getAllPayments();

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET BY ID
========================= */
const getPaymentById = async (req, res, next) => {
  try {
    const [rows] = await Payment.getPaymentById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Payment not found", 404));
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE
========================= */
const updatePayment = async (req, res, next) => {
  try {
    const [result] = await Payment.updatePayment(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Payment not found", 404));
    }

    res.json({
      success: true,
      message: "Payment updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deletePayment = async (req, res, next) => {
  try {
    const [result] = await Payment.deletePayment(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Payment not found", 404));
    }

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};