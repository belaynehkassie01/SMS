// format date to YYYY-MM-DD
const formatDate = (date) => {
  return new Date(date).toISOString().split("T")[0];
};

// check empty values
const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    value.toString().trim() === ""
  );
};

// generate random student number
const generateStudentNumber = () => {
  return "STU-" + Math.floor(100000 + Math.random() * 900000);
};

module.exports = {
  formatDate,
  isEmpty,
  generateStudentNumber,
};