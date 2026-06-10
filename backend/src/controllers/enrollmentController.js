const Enrollment = require("../models/enrollmentModel");
const AppError = require("../utils/AppError");

/* =========================
   CREATE ENROLLMENT
========================= */
const createEnrollment = async (req, res, next) => {
  try {
    const { StudentID, SectionID } = req.body;

    // check duplicate
    const [dup] = await Enrollment.checkDuplicate(StudentID, SectionID);
    if (dup.length > 0) {
      return next(new AppError("Student already enrolled", 400));
    }

    // check capacity
    const [capRows] = await Enrollment.getSectionCapacity(SectionID);
    if (capRows.length === 0) {
      return next(new AppError("Section not found", 404));
    }

    const capacity = capRows[0].Capacity;

    const [countRows] = await Enrollment.countBySection(SectionID);
    const enrolled = countRows[0].total;

    if (enrolled >= capacity) {
      return next(new AppError("Section is full", 400));
    }

    await Enrollment.createEnrollment(req.body);

    res.status(201).json({
      success: true,
      message: "Enrollment created successfully",
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL - MODIFIED TO FILTER BY STUDENT ROLE
========================= */
/* =========================
   GET ALL - MODIFIED TO FILTER BY STUDENT ROLE
========================= */
const getAllEnrollments = async (req, res, next) => {
  try {
  
    let rows;
    
    // If user is Student, only get their own enrollments
    if (req.user.role === 'Student') {
      console.log('Fetching enrollments for StudentID:', req.user.id);
      // Pass student ID to model method
      [rows] = await Enrollment.getEnrollmentsByStudent(req.user.id);
      console.log('Number of rows found:', rows.length);
      console.log('First row:', rows[0]);
    } else {
      // Admin and Teacher get all enrollments
      [rows] = await Enrollment.getAllEnrollments();
      console.log('Total enrollments for Admin/Teacher:', rows.length);
    }

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error('Error in getAllEnrollments:', error);
    next(error);
  }
};

/* =========================
   GET BY ID - ADD OWNERSHIP CHECK
========================= */
const getEnrollmentById = async (req, res, next) => {
  try {
    const [rows] = await Enrollment.getEnrollmentById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Enrollment not found", 404));
    }

    const enrollment = rows[0];
    
    // If user is Student, check if this enrollment belongs to them
    if (req.user.role === 'Student' && enrollment.StudentID !== req.user.id) {
      return next(new AppError("Access denied. You can only view your own enrollments.", 403));
    }

    res.json({
      success: true,
      data: enrollment,
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE
========================= */
const updateEnrollment = async (req, res, next) => {
  try {
    const [result] = await Enrollment.updateEnrollment(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Enrollment not found", 404));
    }

    res.json({
      success: true,
      message: "Enrollment updated successfully",
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deleteEnrollment = async (req, res, next) => {
  try {
    const [result] = await Enrollment.deleteEnrollment(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Enrollment not found", 404));
    }

    res.json({
      success: true,
      message: "Enrollment deleted successfully",
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};