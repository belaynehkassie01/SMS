// pages/enrollments/EnrollmentForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEnrollment } from '../../services/enrollmentService';
import { getStudents } from '../../services/studentService';
import { getSections } from '../../services/sectionService';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EnrollmentForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/enrollments');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    studentId: '',
    sectionId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    status: 'Enrolled',
  });

  const [errors, setErrors] = useState({});

  // Fetch students
  const { data: studentsResponse, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  // Fetch sections
  const { data: sectionsResponse, isLoading: loadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
  });

  // Extract data
  let students = [];
  if (studentsResponse?.data && Array.isArray(studentsResponse.data)) {
    students = studentsResponse.data;
  } else if (studentsResponse?.data?.data && Array.isArray(studentsResponse.data.data)) {
    students = studentsResponse.data.data;
  }

  let sections = [];
  if (sectionsResponse?.data && Array.isArray(sectionsResponse.data)) {
    sections = sectionsResponse.data;
  } else if (sectionsResponse?.data?.data && Array.isArray(sectionsResponse.data.data)) {
    sections = sectionsResponse.data.data;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = 'Student is required';
    if (!formData.sectionId) newErrors.sectionId = 'Section is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        StudentID: parseInt(data.studentId),
        SectionID: parseInt(data.sectionId),
        EnrollmentDate: data.enrollmentDate,
        Status: data.status,
      };
      return createEnrollment(payload);
    },
    onSuccess: () => {
      success('Enrollment created successfully');
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      navigate('/enrollments');
    },
    onError: (err) => {
      const errorMsg = err?.response?.data?.message || 'Create failed';
      notifyError(errorMsg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    createMutation.mutate(formData);
  };

  const isLoading = createMutation.isLoading;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold text-dark">
            <i className="bi bi-journal-plus me-2 text-primary"></i>
            New Enrollment
          </h2>
          <p className="text-secondary mb-0">Enroll a student in a course section</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/enrollments')}>
          ← Back
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body bg-white p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">
                  Student <span className="text-danger">*</span>
                </label>
                <select
                  name="studentId"
                  className={`form-select bg-white text-dark ${errors.studentId ? 'is-invalid' : ''}`}
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={loadingStudents}
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.StudentID} value={student.StudentID}>
                      {student.FirstName} {student.LastName} ({student.StudentNumber})
                    </option>
                  ))}
                </select>
                {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">
                  Section <span className="text-danger">*</span>
                </label>
                <select
                  name="sectionId"
                  className={`form-select bg-white text-dark ${errors.sectionId ? 'is-invalid' : ''}`}
                  value={formData.sectionId}
                  onChange={handleChange}
                  disabled={loadingSections}
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section.SectionID} value={section.SectionID}>
                      {section.SectionName} - {section.CourseTitle} (Cap: {section.Capacity})
                    </option>
                  ))}
                </select>
                {errors.sectionId && <div className="invalid-feedback">{errors.sectionId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">Enrollment Date</label>
                <input
                  type="date"
                  name="enrollmentDate"
                  className="form-control bg-white text-dark"
                  value={formData.enrollmentDate}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">Status</label>
                <select
                  name="status"
                  className="form-select bg-white text-dark"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Enrolled">Enrolled</option>
                  <option value="Dropped">Dropped</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/enrollments')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Enrollment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentForm;