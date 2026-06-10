// controllers/attendanceController.js
const Attendance = require("../models/attendanceModel");
const AppError = require("../utils/AppError");

/* =========================
   MARK ATTENDANCE
========================= */
const markAttendance = async (req, res, next) => {
  try {
    await Attendance.markAttendance(req.body);

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL - MODIFIED TO FILTER BY STUDENT ROLE
========================= */
const getAllAttendance = async (req, res, next) => {
  try {
    let rows;
    
    // If user is Student, only get their own attendance
    if (req.user.role === 'Student') {
      [rows] = await Attendance.getAttendanceByStudent(req.user.id);
    } else {
      // Admin and Teacher get all attendance
      [rows] = await Attendance.getAllAttendance();
    }

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET BY ID - ADD OWNERSHIP CHECK
========================= */
const getAttendanceById = async (req, res, next) => {
  try {
    const [rows] = await Attendance.getAttendanceById(req.params.id);

    if (rows.length === 0) {
      return next(new AppError("Attendance record not found", 404));
    }

    const attendance = rows[0];
    
    // If user is Student, check if this attendance belongs to them
    if (req.user.role === 'Student' && attendance.StudentID !== req.user.id) {
      return next(new AppError("Access denied. You can only view your own attendance records.", 403));
    }

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE ATTENDANCE
========================= */
const updateAttendance = async (req, res, next) => {
  try {
    const [result] = await Attendance.updateAttendance(
      req.params.id,
      req.body
    );

    if (result.affectedRows === 0) {
      return next(new AppError("Attendance record not found", 404));
    }

    res.json({
      success: true,
      message: "Attendance updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
const deleteAttendance = async (req, res, next) => {
  try {
    const [result] = await Attendance.deleteAttendance(req.params.id);

    if (result.affectedRows === 0) {
      return next(new AppError("Attendance not found", 404));
    }

    res.json({
      success: true,
      message: "Attendance deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  markAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
};