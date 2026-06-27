// models/studentModel.js
const db = require("../config/database");

// CREATE STUDENT (with auto Person creation)
const createStudent = async (data) => {
  const connection = await db.getConnection();

  try {
    console.log("📝 Creating student with data:", data);
    
    await connection.beginTransaction();

    // 🔥 FIX: Map gender values
    const genderMap = {
        'Male': 'M',
        'Female': 'F',
        'Other': 'O',
        'male': 'M',
        'female': 'F',
        'other': 'O',
        'M': 'M',
        'F': 'F',
        'O': 'O'
    };
    const mappedGender = genderMap[data.Gender] || genderMap[data.gender] || null;

    // 1. Insert Person first
    const [personResult] = await connection.query(
      `INSERT INTO Person (FirstName, LastName, Email, Phone, Address, Gender, BirthDate, IsActive, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        data.FirstName,
        data.LastName,
        data.Email || null,
        data.Phone || null,
        data.Address || null,
        mappedGender, // ✅ Fixed
        data.BirthDate || null,
      ]
    );

    const personId = personResult.insertId;
    console.log("✅ Person created with ID:", personId);

    // 2. Insert Student
    const [studentResult] = await connection.query(
      `INSERT INTO Student 
      (StudentNumber, PersonID, DepartmentID, SectionID, EnrollmentDate, Status, GuardianName, GuardianPhone, GuardianEmail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.StudentNumber,
        personId,
        data.DepartmentID || null,
        data.SectionID || null,
        data.EnrollmentDate || null,
        data.Status || 'Active',
        data.GuardianName || null,
        data.GuardianPhone || null,
        data.GuardianEmail || null,
      ]
    );

    console.log("✅ Student created with ID:", studentResult.insertId);
    
    await connection.commit();
    return { success: true };

  } catch (error) {
    await connection.rollback();
    console.error("❌ Error in createStudent:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// GET ALL STUDENTS
const getAllStudents = () => {
  const sql = `
    SELECT 
      s.StudentID,
      s.StudentNumber,
      s.Status,
      s.DepartmentID,
      s.SectionID,
      s.EnrollmentDate,
      s.GuardianName,
      s.GuardianPhone,
      s.GuardianEmail,
      s.PersonID,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Address,
      p.Gender,
      p.BirthDate,
      d.DeptName as DepartmentName
    FROM Student s
    JOIN Person p ON s.PersonID = p.PersonID
    LEFT JOIN Department d ON s.DepartmentID = d.DeptID
    ORDER BY s.StudentID DESC
  `;

  return db.query(sql);
};

// ✅ FIXED: GET STUDENT BY ID - Handles both PersonID and StudentID
const getStudentById = (id) => {
  const sql = `
    SELECT 
      s.StudentID,
      s.StudentNumber,
      s.DepartmentID,
      s.SectionID,
      s.EnrollmentDate,
      s.Status,
      s.GuardianName,
      s.GuardianPhone,
      s.GuardianEmail,
      s.PersonID,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Address,
      p.Gender,
      p.BirthDate,
      d.DeptName as DepartmentName
    FROM Student s
    JOIN Person p ON s.PersonID = p.PersonID
    LEFT JOIN Department d ON s.DepartmentID = d.DeptID
    WHERE s.StudentID = ? OR s.PersonID = ?
  `;

  return db.query(sql, [id, id]);
};

// GET STUDENT BY PERSON ID
const getStudentByPersonId = (personId) => {
  const sql = `
    SELECT 
      s.StudentID,
      s.StudentNumber,
      s.DepartmentID,
      s.SectionID,
      s.EnrollmentDate,
      s.Status,
      s.GuardianName,
      s.GuardianPhone,
      s.GuardianEmail,
      s.PersonID,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Address,
      p.Gender,
      p.BirthDate,
      d.DeptName as DepartmentName
    FROM Student s
    JOIN Person p ON s.PersonID = p.PersonID
    LEFT JOIN Department d ON s.DepartmentID = d.DeptID
    WHERE s.PersonID = ?
  `;
  return db.query(sql, [personId]);
};

// GET STUDENT BY STUDENT ID
const getStudentByStudentId = (studentId) => {
  const sql = `
    SELECT 
      s.StudentID,
      s.StudentNumber,
      s.DepartmentID,
      s.SectionID,
      s.EnrollmentDate,
      s.Status,
      s.GuardianName,
      s.GuardianPhone,
      s.GuardianEmail,
      s.PersonID,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Address,
      p.Gender,
      p.BirthDate,
      d.DeptName as DepartmentName
    FROM Student s
    JOIN Person p ON s.PersonID = p.PersonID
    LEFT JOIN Department d ON s.DepartmentID = d.DeptID
    WHERE s.StudentID = ?
  `;
  return db.query(sql, [studentId]);
};

// UPDATE PERSON TABLE (needed for edit)
const updatePerson = async (personId, data) => {
  // 🔥 FIX: Map gender values
  const genderMap = {
      'Male': 'M',
      'Female': 'F',
      'Other': 'O',
      'male': 'M',
      'female': 'F',
      'other': 'O',
      'M': 'M',
      'F': 'F',
      'O': 'O'
  };
  const mappedGender = genderMap[data.Gender] || genderMap[data.gender] || null;

  const sql = `
    UPDATE Person
    SET 
      FirstName = ?,
      LastName = ?,
      Email = ?,
      Phone = ?,
      Address = ?,
      Gender = ?,
      BirthDate = ?,
      UpdatedAt = NOW()
    WHERE PersonID = ?
  `;

  return db.query(sql, [
    data.FirstName,
    data.LastName,
    data.Email || null,
    data.Phone || null,
    data.Address || null,
    mappedGender, // ✅ Fixed
    data.BirthDate || null,
    personId,
  ]);
};

// UPDATE STUDENT TABLE
const updateStudentTable = async (id, data) => {
  const sql = `
    UPDATE Student
    SET 
      StudentNumber = ?,
      DepartmentID = ?,
      SectionID = ?,
      EnrollmentDate = ?,
      Status = ?,
      GuardianName = ?,
      GuardianPhone = ?,
      GuardianEmail = ?
    WHERE StudentID = ?
  `;

  return db.query(sql, [
    data.StudentNumber,
    data.DepartmentID || null,
    data.SectionID || null,
    data.EnrollmentDate || null,
    data.Status || 'Active',
    data.GuardianName || null,
    data.GuardianPhone || null,
    data.GuardianEmail || null,
    id,
  ]);
};

// ✅ FIXED: UPDATE STUDENT (combined) - Handles both PersonID and StudentID
const updateStudent = async (id, data) => {
  const connection = await db.getConnection();

  try {
    console.log("📝 Updating student with ID:", id);
    
    await connection.beginTransaction();

    // 🔥 FIX: Map gender values
    const genderMap = {
        'Male': 'M',
        'Female': 'F',
        'Other': 'O',
        'male': 'M',
        'female': 'F',
        'other': 'O',
        'M': 'M',
        'F': 'F',
        'O': 'O'
    };
    const mappedGender = genderMap[data.Gender] || genderMap[data.gender] || null;
    console.log('📌 Mapped Gender:', mappedGender);

    let personId;
    let studentId;
    
    // 🔥 FIX: Determine if id is PersonID (number) or StudentID (string)
    if (!isNaN(id) && Number.isInteger(Number(id))) {
      // id is a number - treat as PersonID
      personId = id;
      console.log('🔍 Searching by PersonID:', personId);
      
      const [studentRows] = await connection.query(
        `SELECT StudentID FROM Student WHERE PersonID = ?`,
        [personId]
      );
      
      if (!studentRows || studentRows.length === 0) {
        console.log('❌ No student found with PersonID:', personId);
        throw new Error('Student not found');
      }
      
      studentId = studentRows[0].StudentID;
      console.log('✅ Found StudentID:', studentId, 'for PersonID:', personId);
      
    } else {
      // id is a string - treat as StudentID
      studentId = id;
      console.log('🔍 Searching by StudentID:', studentId);
      
      const [studentRows] = await connection.query(
        `SELECT PersonID FROM Student WHERE StudentID = ?`,
        [studentId]
      );
      
      if (!studentRows || studentRows.length === 0) {
        console.log('❌ No student found with StudentID:', studentId);
        throw new Error('Student not found');
      }
      
      personId = studentRows[0].PersonID;
      console.log('✅ Found PersonID:', personId, 'for StudentID:', studentId);
    }

    // 2. Update PERSON table
    await connection.query(
      `UPDATE Person
       SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, Address = ?, Gender = ?, BirthDate = ?, UpdatedAt = NOW()
       WHERE PersonID = ?`,
      [
        data.FirstName,
        data.LastName,
        data.Email || null,
        data.Phone || null,
        data.Address || null,
        mappedGender, // ✅ Fixed
        data.BirthDate || null,
        personId,
      ]
    );

    // 3. Update STUDENT table
    await connection.query(
      `UPDATE Student
       SET StudentNumber = ?, DepartmentID = ?, SectionID = ?, EnrollmentDate = ?, Status = ?,
           GuardianName = ?, GuardianPhone = ?, GuardianEmail = ?
       WHERE StudentID = ?`,
      [
        data.StudentNumber,
        data.DepartmentID || null,
        data.SectionID || null,
        data.EnrollmentDate || null,
        data.Status || 'Active',
        data.GuardianName || null,
        data.GuardianPhone || null,
        data.GuardianEmail || null,
        studentId, // ✅ Using StudentID
      ]
    );

    await connection.commit();
    console.log("✅ Student updated successfully");
    return { success: true };

  } catch (error) {
    await connection.rollback();
    console.error("❌ Error in updateStudent:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// ✅ FIXED: DELETE STUDENT
const deleteStudent = async (personId) => {
  const connection = await db.getConnection();
  
  try {
    console.log('🗑️ Deleting student with PersonID:', personId);
    
    await connection.beginTransaction();
    
    // 1. Get StudentID from PersonID
    const [studentRows] = await connection.query(
      `SELECT StudentID FROM Student WHERE PersonID = ?`,
      [personId]
    );
    
    if (!studentRows.length) {
      throw new Error('Student not found');
    }
    
    const studentId = studentRows[0].StudentID;
    console.log('📌 Found StudentID:', studentId);
    
    // 2. Get all EnrollmentIDs for this student
    const [enrollmentRows] = await connection.query(
      `SELECT EnrollmentID FROM Enrollment WHERE StudentID = ?`,
      [studentId]
    );
    
    const enrollmentIds = enrollmentRows.map(row => row.EnrollmentID);
    console.log('📌 Found EnrollmentIDs:', enrollmentIds);
    
    // 3. Delete Attendance records (references Enrollment)
    if (enrollmentIds.length > 0) {
      const placeholders = enrollmentIds.map(() => '?').join(',');
      await connection.query(
        `DELETE FROM Attendance WHERE EnrollmentID IN (${placeholders})`,
        enrollmentIds
      );
      console.log('✅ Deleted Attendance records');
    }
    
    // 4. Delete Result records (references Enrollment)
    if (enrollmentIds.length > 0) {
      const placeholders = enrollmentIds.map(() => '?').join(',');
      await connection.query(
        `DELETE FROM Result WHERE EnrollmentID IN (${placeholders})`,
        enrollmentIds
      );
      console.log('✅ Deleted Result records');
    }
    
    // 5. Delete Enrollment records (references Student)
    await connection.query(
      `DELETE FROM Enrollment WHERE StudentID = ?`,
      [studentId]
    );
    console.log('✅ Deleted Enrollment records');
    
    // 6. Delete Student record (references Person)
    await connection.query(
      `DELETE FROM Student WHERE PersonID = ?`,
      [personId]
    );
    console.log('✅ Deleted Student record');
    
    // 7. Delete Person record
    const [result] = await connection.query(
      `DELETE FROM Person WHERE PersonID = ?`,
      [personId]
    );
    console.log('✅ Deleted Person record');
    
    await connection.commit();
    console.log('✅ Student and all related records deleted successfully');
    return result;
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error deleting student:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// ✅ FIXED: EXPORT ALL FUNCTIONS
module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  getStudentByPersonId,
  getStudentByStudentId,
  updateStudent,
  deleteStudent,
};