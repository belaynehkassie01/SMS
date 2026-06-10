const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/database");
const limiter = require("./middleware/rateLimiter");

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(limiter);

/* =========================
   ROUTES IMPORT
========================= */
const authRoutes = require("./routes/v1/authRoutes");
const studentRoutes = require("./routes/v1/studentRoutes");
const teacherRoutes = require("./routes/v1/teacherRoutes");
const courseRoutes = require("./routes/v1/courseRoutes");
const sectionRoutes = require("./routes/v1/sectionRoutes");
const enrollmentRoutes = require("./routes/v1/enrollmentRoutes");
const dashboardRoutes = require("./routes/v1/dashboardRoutes");
const departmentRoutes = require("./routes/v1/departmentRoutes");
const academicYearRoutes = require("./routes/v1/academicYearRoutes");
const examRoutes = require("./routes/v1/examRoutes");
const resultRoutes = require("./routes/v1/resultRoutes");
const personRoutes = require("./routes/v1/personRoutes");
const roleRoutes = require("./routes/v1/roleRoutes");
const userRoutes = require("./routes/v1/userRoutes");
const teachesRoutes = require("./routes/v1/teachesRoutes");
const attendanceRoutes = require("./routes/v1/attendanceRoutes");
const paymentRoutes = require("./routes/v1/paymentRoutes");
/* =========================
   ROUTES REGISTER
========================= */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/teachers", teacherRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/sections", sectionRoutes);
app.use("/api/v1/enrollments", enrollmentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/academicyears", academicYearRoutes);
app.use("/api/v1/exams", examRoutes);
app.use("/api/v1/results", resultRoutes);
app.use("/api/v1/persons", personRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/teaches", teachesRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/payments", paymentRoutes);

/* =========================
   ROOT TEST ROUTE
========================= */
app.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");

    res.json({
      success: true,
      message: "Database connected successfully",
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

/* =========================
   ERROR HANDLER
========================= */
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/* =========================
   DEBUG ENV
========================= */
console.log("DB USER:", process.env.DB_USER);
console.log("DB NAME:", process.env.DB_NAME);