// models/teacherModel.js
const db = require("../config/database");

// CREATE TEACHER (with auto Person creation)
const createTeacher = async (data) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Convert empty strings to NULL for Gender
    const genderValue = data.Gender && data.Gender.trim() !== '' ? data.Gender : null;
    const emailValue = data.Email && data.Email.trim() !== '' ? data.Email : null;
    const phoneValue = data.Phone && data.Phone.trim() !== '' ? data.Phone : null;
    const addressValue = data.Address && data.Address.trim() !== '' ? data.Address : null;

    // 1. Create Person record first
    const [personResult] = await connection.query(
      `INSERT INTO Person (FirstName, LastName, Email, Phone, Address, Gender, BirthDate, IsActive, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        data.FirstName || null,
        data.LastName || null,
        emailValue,
        phoneValue,
        addressValue,
        genderValue,
        data.BirthDate || null,
      ]
    );

    const PersonID = personResult.insertId;

    // 2. Create Teacher record
    await connection.query(
      `INSERT INTO Teacher (PersonID, DeptID, HireDate, Salary, Qualification, Specialization)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        PersonID,
        data.DeptID || null,
        data.HireDate || null,
        data.Salary || null,
        data.Qualification || null,
        data.Specialization || null,
      ]
    );

    await connection.commit();
    return { success: true, PersonID };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// GET ALL TEACHERS
const getAllTeachers = () => {
  return db.query(`
    SELECT 
      t.TeacherID,
      t.PersonID,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Address,
      p.Gender,
      p.BirthDate,
      d.DeptName,
      t.DeptID,
      t.HireDate,
      t.Salary,
      t.Qualification,
      t.Specialization
    FROM Teacher t
    LEFT JOIN Person p ON t.PersonID = p.PersonID
    LEFT JOIN Department d ON t.DeptID = d.DeptID
  `);
};

// ✅ FIXED: GET BY ID - Handles both PersonID and TeacherID
const getTeacherById = (id) => {
  return db.query(
    `SELECT 
      t.TeacherID,
      t.PersonID,
      t.DeptID,
      t.HireDate,
      t.Salary,
      t.Qualification,
      t.Specialization,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Address,
      p.Gender,
      p.BirthDate,
      d.DeptName
    FROM Teacher t
    LEFT JOIN Person p ON t.PersonID = p.PersonID
    LEFT JOIN Department d ON t.DeptID = d.DeptID
    WHERE t.TeacherID = ? OR t.PersonID = ?`,
    [id, id]
  );
};

// GET BY PERSON ID
const getTeacherByPersonId = (personId) => {
  return db.query(
    `SELECT 
      t.TeacherID,
      t.PersonID,
      t.DeptID,
      t.HireDate,
      t.Salary,
      t.Qualification,
      t.Specialization,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Address,
      p.Gender,
      p.BirthDate,
      d.DeptName
    FROM Teacher t
    LEFT JOIN Person p ON t.PersonID = p.PersonID
    LEFT JOIN Department d ON t.DeptID = d.DeptID
    WHERE t.PersonID = ?`,
    [personId]
  );
};

// GET BY TEACHER ID
const getTeacherByTeacherId = (teacherId) => {
  return db.query(
    `SELECT 
      t.TeacherID,
      t.PersonID,
      t.DeptID,
      t.HireDate,
      t.Salary,
      t.Qualification,
      t.Specialization,
      p.FirstName,
      p.LastName,
      p.Email,
      p.Phone,
      p.Address,
      p.Gender,
      p.BirthDate,
      d.DeptName
    FROM Teacher t
    LEFT JOIN Person p ON t.PersonID = p.PersonID
    LEFT JOIN Department d ON t.DeptID = d.DeptID
    WHERE t.TeacherID = ?`,
    [teacherId]
  );
};

// ✅ FIXED: SINGLE updateTeacher function (removed duplicate)
const updateTeacher = async (id, data) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // First, determine if id is PersonID or TeacherID
    let personId;
    let teacherId;
    
    if (!isNaN(id) && Number.isInteger(Number(id))) {
      // id is a number - treat as PersonID
      personId = id;
      
      // Get TeacherID
      const [teacherRows] = await connection.query(
        `SELECT TeacherID FROM Teacher WHERE PersonID = ?`,
        [personId]
      );
      
      if (!teacherRows.length) {
        throw new Error('Teacher not found');
      }
      
      teacherId = teacherRows[0].TeacherID;
    } else {
      // id is a string - treat as TeacherID
      teacherId = id;
      
      // Get PersonID
      const [teacherRows] = await connection.query(
        `SELECT PersonID FROM Teacher WHERE TeacherID = ?`,
        [teacherId]
      );
      
      if (!teacherRows.length) {
        throw new Error('Teacher not found');
      }
      
      personId = teacherRows[0].PersonID;
    }
    
    console.log('📌 Updating teacher - PersonID:', personId, 'TeacherID:', teacherId);

    const genderValue = data.Gender && data.Gender.trim() !== '' ? data.Gender : null;
    const emailValue = data.Email && data.Email.trim() !== '' ? data.Email : null;
    const phoneValue = data.Phone && data.Phone.trim() !== '' ? data.Phone : null;
    const addressValue = data.Address && data.Address.trim() !== '' ? data.Address : null;

    // Update Person table
    await connection.query(
      `UPDATE Person 
       SET FirstName = ?, LastName = ?, Email = ?, Phone = ?, 
           Address = ?, Gender = ?, BirthDate = ?, UpdatedAt = NOW()
       WHERE PersonID = ?`,
      [
        data.FirstName || null,
        data.LastName || null,
        emailValue,
        phoneValue,
        addressValue,
        genderValue,
        data.BirthDate || null,
        personId,
      ]
    );

    // Update Teacher table
    await connection.query(
      `UPDATE Teacher 
       SET DeptID = ?, HireDate = ?, Salary = ?, Qualification = ?, Specialization = ?
       WHERE TeacherID = ?`,
      [
        data.DeptID || null,
        data.HireDate || null,
        data.Salary || null,
        data.Qualification || null,
        data.Specialization || null,
        teacherId,
      ]
    );

    await connection.commit();
    return { success: true };
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Update teacher error:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// DELETE TEACHER
const deleteTeacher = async (personId) => {
  const connection = await db.getConnection();
  
  try {
    console.log('🗑️ Deleting teacher with PersonID:', personId);
    
    await connection.beginTransaction();
    
    // 1. Get TeacherID from PersonID
    const [teacherRows] = await connection.query(
      `SELECT TeacherID FROM Teacher WHERE PersonID = ?`,
      [personId]
    );
    
    if (!teacherRows.length) {
      throw new Error('Teacher not found');
    }
    
    const teacherId = teacherRows[0].TeacherID;
    console.log('📌 Found TeacherID:', teacherId);
    
    // 2. Delete Teaches records (references Teacher)
    await connection.query(
      `DELETE FROM Teaches WHERE TeacherID = ?`,
      [teacherId]
    );
    console.log('✅ Deleted Teaches records');
    
    // 3. Delete Teacher record (references Person)
    await connection.query(
      `DELETE FROM Teacher WHERE PersonID = ?`,
      [personId]
    );
    console.log('✅ Deleted Teacher record');
    
    // 4. Delete Person record
    const [result] = await connection.query(
      `DELETE FROM Person WHERE PersonID = ?`,
      [personId]
    );
    console.log('✅ Deleted Person record');
    
    await connection.commit();
    console.log('✅ Teacher and all related records deleted successfully');
    return result;
    
  } catch (error) {
    await connection.rollback();
    console.error('❌ Error deleting teacher:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// ✅ FIXED: EXPORT ALL FUNCTIONS
module.exports = {
  createTeacher,
  getAllTeachers,
  getTeacherById,          // ✅ NOW EXISTS
  getTeacherByPersonId,
  getTeacherByTeacherId,
  updateTeacher,           // ✅ NOW SINGLE
  deleteTeacher,
};