// routes/v1/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../../controllers/attendanceController');
const verifyToken = require('../../middleware/authMiddleware');
const authorizeRoles = require('../../middleware/roleMiddleware');

// All routes require authentication
router.use(verifyToken);

// Routes
router.post('/', authorizeRoles('Admin', 'Teacher'), attendanceController.markAttendance);
router.get('/', authorizeRoles('Admin', 'Teacher', 'Student'), attendanceController.getAllAttendance);
router.get('/:id', authorizeRoles('Admin', 'Teacher', 'Student'), attendanceController.getAttendanceById);
router.put('/:id', authorizeRoles('Admin', 'Teacher'), attendanceController.updateAttendance);
router.delete('/:id', authorizeRoles('Admin', 'Teacher'), attendanceController.deleteAttendance);

module.exports = router;