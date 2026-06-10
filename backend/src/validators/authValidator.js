const validateLogin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  next();
};

const validateRegister = (req, res, next) => {
  const { username, password, roleId, personId } = req.body;

  if (!username || !password || !roleId || !personId) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  next();
};

module.exports = {
  validateLogin,
  validateRegister,
};