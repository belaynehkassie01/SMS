const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const AppError = require("../utils/AppError");

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;


    const [users] = await db.query(
      `
      SELECT 
        ua.UserID,
        ua.Username,
        ua.PasswordHash,
        r.RoleName,
        p.PersonID,
        p.FirstName,
        p.LastName
      FROM UserAccount ua
      JOIN Role r ON ua.RoleID = r.RoleID
      JOIN Person p ON ua.PersonID = p.PersonID
      WHERE ua.Username = ?
      `,
      [username]
    );

    // USER NOT FOUND
    if (!users || users.length === 0) {
      return next(new AppError("Invalid username or password", 401));
    }

    const user = users[0];
    console.log('User found:', { UserID: user.UserID, Role: user.RoleName, PersonID: user.PersonID });

    // PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.PasswordHash);

    if (!isMatch) {
      return next(new AppError("Invalid username or password", 401));
    }

    // GET THE APPROPRIATE ID BASED ON ROLE
    let idForToken = user.UserID; // Default to UserID

    if (user.RoleName === 'Student') {
      const [student] = await db.query(
        `SELECT StudentID FROM Student WHERE PersonID = ?`,
        [user.PersonID]
      );
      console.log('Student query result:', student);
      if (student && student.length > 0) {
        idForToken = student[0].StudentID;
        console.log('Student ID found:', idForToken);
      } else {
        console.log('No StudentID found for PersonID:', user.PersonID);
      }
    } 
    else if (user.RoleName === 'Teacher') {
      const [teacher] = await db.query(
        `SELECT TeacherID FROM Teacher WHERE PersonID = ?`,
        [user.PersonID]
      );
      if (teacher && teacher.length > 0) {
        idForToken = teacher[0].TeacherID;
        console.log('Teacher ID found:', idForToken);
      }
    }


    // TOKEN GENERATION - USE 'id' FIELD
    const token = jwt.sign(
      {
        id: idForToken,           
        role: user.RoleName,
        username: user.Username,
        personId: user.PersonID
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      }
    );

    console.log('Token created successfully');

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: idForToken,
        username: user.Username,
        role: user.RoleName,
        fullName: `${user.FirstName} ${user.LastName}`,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

module.exports = { login };