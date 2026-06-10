// models/paymentModel.js
const db = require("../config/database");

/* =========================
   CREATE PAYMENT
========================= */
const createPayment = (data) => {
  const {
    StudentID,
    AcademicYearID,
    Amount,
    PaymentDate,
    Status,
    Remarks,
  } = data;

  return db.query(
    `INSERT INTO Payment
    (
      StudentID,
      AcademicYearID,
      Amount,
      PaymentDate,
      Status,
      Remarks,
      CreatedAt,
      UpdatedAt
    )
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      StudentID,
      AcademicYearID,
      Amount,
      PaymentDate,
      Status,
      Remarks,
    ]
  );
};

/* =========================
   GET ALL PAYMENTS
========================= */
const getAllPayments = () => {
  return db.query(`
    SELECT
      p.PaymentID,
      p.Amount,
      p.PaymentDate,
      p.Status,
      p.Remarks,
      p.CreatedAt,
      s.StudentNumber,
      pe.FirstName,
      pe.LastName,
      a.Year,
      a.Semester
    FROM Payment p
    JOIN Student s ON p.StudentID = s.StudentID
    JOIN Person pe ON s.PersonID = pe.PersonID
    LEFT JOIN AcademicYear a ON p.AcademicYearID = a.AcademicYearID
    ORDER BY p.PaymentID DESC
  `);
};

/* =========================
   GET BY ID (FIXED)
========================= */
const getPaymentById = (id) => {
  return db.query(
    `
    SELECT
      p.PaymentID,
      p.Amount,
      p.PaymentDate,
      p.Status,
      p.Remarks,
      p.CreatedAt,
      p.UpdatedAt,
      p.StudentID,
      p.AcademicYearID,
      s.StudentNumber,
      pe.FirstName,
      pe.LastName,
      a.Year,
      a.Semester
    FROM Payment p
    JOIN Student s ON p.StudentID = s.StudentID
    JOIN Person pe ON s.PersonID = pe.PersonID
    LEFT JOIN AcademicYear a ON p.AcademicYearID = a.AcademicYearID
    WHERE p.PaymentID = ?
    `,
    [id]
  );
};

/* =========================
   UPDATE PAYMENT
========================= */
const updatePayment = (id, data) => {
  const {
    StudentID,
    AcademicYearID,
    Amount,
    PaymentDate,
    Status,
    Remarks,
  } = data;

  return db.query(
    `
    UPDATE Payment
    SET
      StudentID = ?,
      AcademicYearID = ?,
      Amount = ?,
      PaymentDate = ?,
      Status = ?,
      Remarks = ?,
      UpdatedAt = NOW()
    WHERE PaymentID = ?
    `,
    [
      StudentID,
      AcademicYearID,
      Amount,
      PaymentDate,
      Status,
      Remarks,
      id,
    ]
  );
};

/* =========================
   DELETE PAYMENT
========================= */
const deletePayment = (id) => {
  return db.query(
    `
    DELETE FROM Payment
    WHERE PaymentID = ?
    `,
    [id]
  );
};

module.exports = {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};