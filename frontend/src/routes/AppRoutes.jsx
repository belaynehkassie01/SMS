import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";

// Pages
import Login from "../pages/auth/Login";
import Forbidden from "../pages/errors/Forbidden";
import NotFound from "../pages/errors/NotFound";
import Profile from "../pages/profile/Profile";

// Protected Route
import ProtectedRoute from "../components/protect/ProtectedRoute";

// Dashboards
import RoleDashboard from "../pages/dashboard/RoleDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import TeacherDashboard from "../pages/dashboard/TeacherDashboard";
import StudentDashboard from "../pages/dashboard/StudentDashboard";

// User Management
import UserList from "../pages/users/UserList";
import CreateUser from "../pages/users/CreateUser";
import EditUser from "../pages/users/EditUser";

// Student
import StudentList from "../pages/students/StudentList";
import StudentForm from "../pages/students/StudentForm";
import EditStudent from "../pages/students/EditStudent";
import StudentDetails from "../pages/students/StudentDetails";

// Teacher
import TeacherList from "../pages/teachers/TeacherList";
import TeacherForm from "../pages/teachers/TeacherForm";
import EditTeacher from "../pages/teachers/EditTeacher";      
import TeacherDetails from "../pages/teachers/TeacherDetails"; 

// Course
import CourseList from "../pages/courses/CourseList";
import CourseForm from "../pages/courses/CourseForm";
import EditCourse from "../pages/courses/EditCourse";
import CourseDetails from "../pages/courses/CourseDetails";

// Department
import DepartmentList from "../pages/departments/DepartmentList";
import DepartmentForm from "../pages/departments/DepartmentForm";
import EditDepartment from "../pages/departments/EditDepartment";
import DepartmentDetails from "../pages/departments/DepartmentDetails";

// Section
import SectionList from "../pages/sections/SectionList";
import SectionForm from "../pages/sections/SectionForm";
import EditSection from "../pages/sections/EditSection";
import SectionDetails from "../pages/sections/SectionDetails";

// Enrollment
import EnrollmentList from "../pages/enrollment/EnrollmentList";
import EnrollmentForm from "../pages/enrollment/EnrollmentForm";
import EditEnrollment from "../pages/enrollment/EditEnrollment";
import EnrollmentDetails from "../pages/enrollment/EnrollmentDetails";

// Academic Year
import AcademicYearList from "../pages/academicYears/AcademicYearList";
import AcademicYearForm from "../pages/academicYears/AcademicYearForm";
import EditAcademicYear from "../pages/academicYears/EditAcademicYear";
import AcademicYearDetails from "../pages/academicYears/AcademicYearDetails";

// Exams 
import ExamList from "../pages/exams/ExamList";
import ExamForm from "../pages/exams/ExamForm";
import EditExam from "../pages/exams/EditExam";
import ExamDetails from "../pages/exams/ExamDetails";

// Results
import ResultList from "../pages/results/ResultList";
import ResultForm from "../pages/results/ResultForm";
import EditResult from "../pages/results/EditResult";
import ResultDetails from "../pages/results/ResultDetails";

//Attendance
import AttendanceList from "../pages/attendance/AttendanceList";
import MarkAttendance from "../pages/attendance/MarkAttendance";
import EditAttendance from "../pages/attendance/EditAttendance";
import AttendanceDetails from "../pages/attendance/AttendanceDetails";

// Payments
import PaymentList from "../pages/payments/PaymentList";
import PaymentForm from "../pages/payments/PaymentForm";
import EditPayment from "../pages/payments/EditPayment";
import PaymentDetails from "../pages/payments/PaymentDetails";


// Teaches
import TeachesList from "../pages/teaches/TeachesList";
import AssignTeacherForm from "../pages/teaches/AssignTeacherForm";
import TeachesDetails from "../pages/teaches/TeachesDetails";
import EditTeach from "../pages/teaches/EditTeach";


// Roles
import { ROLES } from "../constants/roles";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ERRORS */}
        <Route element={<BlankLayout />}>
          <Route path="/403" element={<Forbidden />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* APP */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* Root path - Role based redirect */}
          <Route index element={<RoleDashboard />} />
          
          {/* Direct dashboard access */}
          <Route path="dashboard" element={<RoleDashboard />} />

          {/* ADMIN DASHBOARD */}
          <Route
            path="dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* TEACHER DASHBOARD */}
          <Route
            path="dashboard/teacher"
            element={
              <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* STUDENT DASHBOARD */}
          <Route
            path="dashboard/student"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* ================= PROFILE ================= */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* ================= USER MANAGEMENT (Admin only) ================= */}
          <Route
            path="users"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <CreateUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditUser />
              </ProtectedRoute>
            }
          />

          {/* ================= STUDENTS ================= */}
          <Route
            path="students"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <StudentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <StudentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditStudent />
              </ProtectedRoute>
            }
          />
          <Route
            path="students/edit"
            element={<Navigate to="/students" replace />}
          />

          {/* ================= TEACHERS ================= */}
          <Route
            path="teachers"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <TeacherList />
              </ProtectedRoute>
            }
          />
          <Route
            path="teachers/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <TeacherDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="teachers/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <TeacherForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="teachers/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditTeacher />
              </ProtectedRoute>
            }
          />
          <Route
            path="teachers/edit"
            element={<Navigate to="/teachers" replace />}
          />

          {/* ================= COURSES ================= */}
          {/* Students can view courses */}
          <Route
            path="courses"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <CourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <CourseDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditCourse />
              </ProtectedRoute>
            }
          />
          <Route
            path="courses/edit"
            element={<Navigate to="/courses" replace />}
          />

          {/* ================= DEPARTMENTS ================= */}
          <Route
            path="departments"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DepartmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="departments/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DepartmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="departments/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <DepartmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="departments/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditDepartment />
              </ProtectedRoute>
            }
          />
          <Route
            path="departments/edit"
            element={<Navigate to="/departments" replace />}
          />

          {/* ================= SECTIONS ================= */}
          {/* Students can view sections */}
          <Route
            path="sections"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <SectionList />
              </ProtectedRoute>
            }
          />
          <Route
            path="sections/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <SectionDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="sections/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <SectionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="sections/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditSection />
              </ProtectedRoute>
            }
          />
          <Route
            path="sections/edit"
            element={<Navigate to="/sections" replace />}
          />

          {/* ================= ENROLLMENTS ================= */}
          {/* Students can view their own enrollments */}
          <Route
            path="enrollments"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <EnrollmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="enrollments/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <EnrollmentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="enrollments/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EnrollmentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="enrollments/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditEnrollment />
              </ProtectedRoute>
            }
          />
          <Route
            path="enrollments/edit"
            element={<Navigate to="/enrollments" replace />}
          />

          {/* ================= ACADEMIC YEARS ================= */}
          <Route
            path="academic-years"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AcademicYearList />
              </ProtectedRoute>
            }
          />
          <Route
            path="academic-years/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AcademicYearDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="academic-years/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AcademicYearForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="academic-years/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditAcademicYear />
              </ProtectedRoute>
            }
          />
          <Route
            path="academic-years/edit"
            element={<Navigate to="/academic-years" replace />}
          />
          
          {/* ================= EXAMS ================= */}
          {/* Students can view exams */}
          <Route
            path="exams"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <ExamList />
              </ProtectedRoute>
            }
          />
          <Route
            path="exams/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <ExamDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="exams/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <ExamForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="exams/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <EditExam />
              </ProtectedRoute>
            }
          />
          <Route
            path="exams/edit"
            element={<Navigate to="/exams" replace />}
          />

          {/* ================= RESULTS ================= */}
          {/* Students can view their own results */}
          <Route
            path="results"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <ResultList />
              </ProtectedRoute>
            }
          />
          <Route
            path="results/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <ResultDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="results/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <ResultForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="results/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <EditResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="results/edit"
            element={<Navigate to="/results" replace />}
          />

          {/* ================= ATTENDANCE ================= */}
          {/* Students can view their own attendance */}
          <Route
            path="attendance"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <AttendanceList />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendance/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <MarkAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendance/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <EditAttendance />
              </ProtectedRoute>
            }
          />    
          <Route
            path="attendance/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT]}>
                <AttendanceDetails />
              </ProtectedRoute>
            }
          />
          
          {/* ================= PAYMENTS ================= */}
          {/* Students can view their own payments */}
          <Route
            path="payments"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STUDENT]}>
                <PaymentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="payments/view/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STUDENT]}>
                <PaymentDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="payments/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <PaymentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="payments/edit/:id"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <EditPayment />
              </ProtectedRoute>
            }
          />
          <Route
            path="payments/edit"
            element={<Navigate to="/payments" replace />}
          />
  {/* ================= TEACHES ================= */}
          <Route
            path="teaches"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                <TeachesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="teaches/create"
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <AssignTeacherForm />
              </ProtectedRoute>
            }
          />
           <Route
                path="teaches/view/:id"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.TEACHER]}>
                    <TeachesDetails />
                  </ProtectedRoute>
                }
              />
            <Route
              path="teaches/edit/:id"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <EditTeach />
                </ProtectedRoute>
              }
            />
            
        </Route>
      </Routes>
    </BrowserRouter>
  );
}