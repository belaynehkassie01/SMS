const bcrypt = require("bcryptjs");

async function hashPassword() {
  const password = "admin123"; // your real password pass:admin123 user:admin
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  console.log(hash);
}

hashPassword();