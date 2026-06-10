CREATE DATABASE IF NOT EXISTS school_management_system;
USE school_management_system;

-- =========================
-- 1. PERSON
-- =========================
CREATE TABLE Person (
    PersonID INT AUTO_INCREMENT PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Gender ENUM('M','F','O'),
    BirthDate DATE,
    Phone VARCHAR(20),
    Email VARCHAR(100) UNIQUE,
    Address TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE
);

-- =========================
-- 2. ROLE
-- =========================
CREATE TABLE Role (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50),
    Description TEXT,
    RoleLevel INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 3. USERACCOUNT
-- =========================
CREATE TABLE UserAccount (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    PersonID INT,
    Username VARCHAR(50) UNIQUE,
    PasswordHash VARCHAR(255),
    RoleID INT,
    IsActive BOOLEAN DEFAULT TRUE,
    LastLogin DATETIME,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (PersonID) REFERENCES Person(PersonID),
    FOREIGN KEY (RoleID) REFERENCES Role(RoleID)
);

-- =========================
-- 4. DEPARTMENT
-- =========================
CREATE TABLE Department (
    DeptID INT AUTO_INCREMENT PRIMARY KEY,
    DeptName VARCHAR(100),
    HeadOfDept VARCHAR(100),
    Phone VARCHAR(20),
    Location VARCHAR(100),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE
);

-- =========================
-- 5. STUDENT
-- =========================
CREATE TABLE Student (
    StudentID INT AUTO_INCREMENT PRIMARY KEY,
    PersonID INT,
    StudentNumber VARCHAR(50) UNIQUE,
    DepartmentID INT,
    EnrollmentDate DATE,
    Status VARCHAR(20),
    GuardianName VARCHAR(100),
    GuardianPhone VARCHAR(20),
    GuardianEmail VARCHAR(100),
    FOREIGN KEY (PersonID) REFERENCES Person(PersonID),
    FOREIGN KEY (DepartmentID) REFERENCES Department(DeptID)
);

-- =========================
-- 6. TEACHER
-- =========================
CREATE TABLE Teacher (
    TeacherID INT AUTO_INCREMENT PRIMARY KEY,
    PersonID INT,
    DeptID INT,
    HireDate DATE,
    Salary DECIMAL(10,2),
    Qualification VARCHAR(100),
    Specialization VARCHAR(100),
    FOREIGN KEY (PersonID) REFERENCES Person(PersonID),
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

-- =========================
-- 7. COURSE
-- =========================
CREATE TABLE Course (
    CourseID INT AUTO_INCREMENT PRIMARY KEY,
    CourseCode VARCHAR(20),
    Title VARCHAR(100),
    Credits INT,
    Description TEXT,
    DeptID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID)
);

-- =========================
-- 8. ACADEMIC YEAR
-- =========================
CREATE TABLE AcademicYear (
    AcademicYearID INT AUTO_INCREMENT PRIMARY KEY,
    Year VARCHAR(20),
    Semester VARCHAR(20),
    StartDate DATE,
    EndDate DATE,
    IsActive BOOLEAN DEFAULT TRUE,
    UNIQUE (Year, Semester)
);

-- =========================
-- 9. SECTION
-- =========================
CREATE TABLE Section (
    SectionID INT AUTO_INCREMENT PRIMARY KEY,
    SectionName VARCHAR(50),
    CourseID INT,
    AcademicYearID INT,
    RoomNumber VARCHAR(20),
    Schedule VARCHAR(100),
    Capacity INT,
    CurrentEnrollment INT DEFAULT 0,
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (CourseID) REFERENCES Course(CourseID),
    FOREIGN KEY (AcademicYearID) REFERENCES AcademicYear(AcademicYearID)
);

-- =========================
-- 10. ENROLLMENT
-- =========================
CREATE TABLE Enrollment (
    EnrollmentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    SectionID INT,
    EnrollmentDate DATE,
    Status VARCHAR(20),
    DropDate DATE,
    DropReason TEXT,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (SectionID) REFERENCES Section(SectionID)
);

-- =========================
-- 11. TEACHES
-- =========================
CREATE TABLE Teaches (
    TeachesID INT AUTO_INCREMENT PRIMARY KEY,
    TeacherID INT,
    SectionID INT,
    IsPrimaryTeacher BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (TeacherID) REFERENCES Teacher(TeacherID),
    FOREIGN KEY (SectionID) REFERENCES Section(SectionID)
);

-- =========================
-- 12. EXAM
-- =========================
CREATE TABLE Exam (
    ExamID INT AUTO_INCREMENT PRIMARY KEY,
    SectionID INT,
    ExamName VARCHAR(100),
    ExamDate DATE,
    MaxMarks INT,
    Weightage DECIMAL(5,2),
    FOREIGN KEY (SectionID) REFERENCES Section(SectionID)
);

-- =========================
-- 13. RESULT
-- =========================
CREATE TABLE Result (
    ResultID INT AUTO_INCREMENT PRIMARY KEY,
    EnrollmentID INT,
    ExamID INT,
    ObtainedMarks INT,
    Grade VARCHAR(5),
    Percentage DECIMAL(5,2),
    IsFinalGrade BOOLEAN DEFAULT FALSE,
    Remarks TEXT,
    FOREIGN KEY (EnrollmentID) REFERENCES Enrollment(EnrollmentID),
    FOREIGN KEY (ExamID) REFERENCES Exam(ExamID)
);

-- =========================
-- 14. ATTENDANCE
-- =========================
CREATE TABLE Attendance (
    AttendanceID INT AUTO_INCREMENT PRIMARY KEY,
    EnrollmentID INT,
    Date DATE,
    Status ENUM('Present','Absent','Late'),
    CheckInTime TIME,
    CheckOutTime TIME,
    Remarks TEXT,
    FOREIGN KEY (EnrollmentID) REFERENCES Enrollment(EnrollmentID)
);

-- =========================
-- 15. PAYMENT
-- =========================
CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    StudentID INT,
    AcademicYearID INT,
    Amount DECIMAL(10,2),
    PaymentDate DATE,
    Status ENUM('Paid','Unpaid'),
    Remarks TEXT,
    FOREIGN KEY (StudentID) REFERENCES Student(StudentID),
    FOREIGN KEY (AcademicYearID) REFERENCES AcademicYear(AcademicYearID)
);