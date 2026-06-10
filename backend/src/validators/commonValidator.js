const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    value.toString().trim() === ""
  );
};

const validateId = (id) => {
  return !isNaN(id) && Number(id) > 0;
};

const validateEmail = (email) => {
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
};

module.exports = {
  isEmpty,
  validateId,
  validateEmail,
};