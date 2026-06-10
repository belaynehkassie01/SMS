const db = require("../config/database");
const AppError = require("../utils/AppError");

// DASHBOARD STATS (Enhanced)
const getStats = async (req, res, next) => {
  try {
    // Basic counts (use correct table names with capital letters)
    const [[students]] = await db.query("SELECT COUNT(*) AS totalStudents FROM Student");
    const [[teachers]] = await db.query("SELECT COUNT(*) AS totalTeachers FROM Teacher");
    const [[courses]] = await db.query("SELECT COUNT(*) AS totalCourses FROM Course");
    const [[departments]] = await db.query("SELECT COUNT(*) AS totalDepartments FROM Department");
    const [[payments]] = await db.query("SELECT COUNT(*) AS totalPayments FROM Payment");

    // Additional counts
    const [[sections]] = await db.query("SELECT COUNT(*) AS totalSections FROM Section");
    const [[enrollments]] = await db.query("SELECT COUNT(*) AS totalEnrollments FROM Enrollment");

    // Financial: total revenue (sum of all payments)
    const [[revenue]] = await db.query("SELECT SUM(Amount) AS totalRevenue FROM Payment");
    
    // Attendance rate for last 30 days (percentage of present)
    const [[attendanceRate]] = await db.query(`
      SELECT 
        ROUND(
          (SUM(CASE WHEN Status = 'Present' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2
        ) AS rate
      FROM Attendance
      WHERE Date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    // Recent enrollments (last 5) with student name & course title
    const [recentEnrollments] = await db.query(`
      SELECT 
        CONCAT(p.FirstName, ' ', p.LastName) AS studentName,
        c.Title AS courseTitle,
        e.EnrollmentDate AS date
      FROM Enrollment e
      JOIN Student s ON e.StudentID = s.StudentID
      JOIN Person p ON s.PersonID = p.PersonID
      JOIN Section sec ON e.SectionID = sec.SectionID
      JOIN Course c ON sec.CourseID = c.CourseID
      ORDER BY e.EnrollmentDate DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        students: students.totalStudents,
        teachers: teachers.totalTeachers,
        courses: courses.totalCourses,
        departments: departments.totalDepartments,
        payments: payments.totalPayments,
        sections: sections.totalSections,
        enrollments: enrollments.totalEnrollments,
        totalRevenue: revenue.totalRevenue || 0,
        attendanceRate: attendanceRate.rate || 0,
        recentEnrollments: recentEnrollments || [],
      },
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    next(error);
  }
};

module.exports = { getStats };