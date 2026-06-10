// utils/validators.js
export const isRequired = (value) => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (value === null || value === undefined) return false;
  return true;
};

export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return re.test(email);
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  // Ethiopian phone numbers (09xxxxxxxx) or international format
  const re = /^(09|2519|+2519)\d{8}$/;
  return re.test(phone.replace(/\s+/g, ''));
};

export const isLengthBetween = (value, min, max) => {
  if (!value) return false;
  const len = value.trim().length;
  return len >= min && len <= max;
};

export const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const validateStudentForm = (data) => {
  const errors = {};
  if (!isRequired(data.firstName)) errors.firstName = 'First name is required';
  if (!isRequired(data.lastName)) errors.lastName = 'Last name is required';
  if (data.email && !isValidEmail(data.email)) errors.email = 'Invalid email address';
  if (data.phone && !isValidPhone(data.phone)) errors.phone = 'Invalid phone number';
  return errors;
};