// constants/roles.js
export const ROLES = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

export const ROLE_LEVELS = {
  [ROLES.ADMIN]: 3,
  [ROLES.TEACHER]: 2,
  [ROLES.STUDENT]: 1,
};

export const isAdmin = (role) => role === ROLES.ADMIN;
export const isTeacher = (role) => role === ROLES.TEACHER;
export const isStudent = (role) => role === ROLES.STUDENT;