// constants/apiEndpoints.js
const API_VERSION = '/api/v1';

export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',

  // Auth & Users
  AUTH: {
    LOGIN: `${API_VERSION}/auth/login`,
  },
  USERS: `${API_VERSION}/users`,           // UserAccount table
  ROLES: `${API_VERSION}/roles`,           // Role table

  // Person management
  PERSONS: `${API_VERSION}/persons`,       // Person table (base)
  STUDENTS: `${API_VERSION}/students`,     // Student table
  TEACHERS: `${API_VERSION}/teachers`,     // Teacher table

  // Academic structure
  DEPARTMENTS: `${API_VERSION}/departments`,
  COURSES: `${API_VERSION}/courses`,
  ACADEMIC_YEARS: `${API_VERSION}/academicyears`,   // Note: no hyphen, as per backend
  SECTIONS: `${API_VERSION}/sections`,
  TEACHES: `${API_VERSION}/teaches`,                // Teaches table

  // Academic activities
  ENROLLMENTS: `${API_VERSION}/enrollments`,
  EXAMS: `${API_VERSION}/exams`,
  RESULTS: `${API_VERSION}/results`,
  ATTENDANCE: `${API_VERSION}/attendance`,

  // Financial
  PAYMENTS: `${API_VERSION}/payments`,

  // Dashboard
  DASHBOARD: `${API_VERSION}/dashboard`,   // Updated to match backend route

  // Helper
  getById: (base, id) => `${base}/${id}`,
};