// pages/enrollments/EditEnrollment.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEnrollmentById, updateEnrollment } from '../../services/enrollmentService';
import { getStudents } from '../../services/studentService';
import { getSections } from '../../services/sectionService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditEnrollment = () => {
  const { id } = useParams();
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
    enrollmentDate: '',
    status: 'Enrolled',
    dropDate: '',
    dropReason: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch enrollment data
  const { data: enrollmentResponse, isLoading: loadingEnrollment } = useQuery({
    queryKey: ['enrollment', id],
    queryFn: () => getEnrollmentById(id),
    enabled: !!id,
  });

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

  useEffect(() => {
    if (enrollmentResponse?.data) {
      const e = enrollmentResponse.data;
      setFormData({
        studentId: e.StudentID || '',
        sectionId: e.SectionID || '',
        enrollmentDate: e.EnrollmentDate ? e.EnrollmentDate.split('T')[0] : '',
        status: e.Status || 'Enrolled',
        dropDate: e.DropDate ? e.DropDate.split('T')[0] : '',
        dropReason: e.DropReason || '',
      });
    }
  }, [enrollmentResponse]);

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

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        StudentID: parseInt(data.studentId),
        SectionID: parseInt(data.sectionId),
        EnrollmentDate: data.enrollmentDate,
        Status: data.status,
        DropDate: data.dropDate || null,
        DropReason: data.dropReason || null,
      };
      return updateEnrollment(id, payload);
    },
    onSuccess: () => {
      success('Enrollment updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment', id] });
      navigate('/enrollments');
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Update failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateMutation.mutate(formData);
  };

  const isLoading = loadingEnrollment || updateMutation.isLoading;

  if (loadingEnrollment) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold text-dark">
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit Enrollment
          </h2>
          <p className="text-secondary mb-0">Update enrollment information</p>
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
                <label className="form-label fw-medium text-dark">Student *</label>
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
                <label className="form-label fw-medium text-dark">Section *</label>
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

              <div className="col-md-4">
                <label className="form-label fw-medium text-dark">Enrollment Date</label>
                <input type="date" name="enrollmentDate" className="form-control bg-white text-dark" value={formData.enrollmentDate} onChange={handleChange} />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium text-dark">Status</label>
                <select name="status" className="form-select bg-white text-dark" value={formData.status} onChange={handleChange}>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Dropped">Dropped</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium text-dark">Drop Date</label>
                <input type="date" name="dropDate" className="form-control bg-white text-dark" value={formData.dropDate} onChange={handleChange} />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium text-dark">Drop Reason</label>
                <textarea name="dropReason" className="form-control bg-white text-dark" rows="2" value={formData.dropReason} onChange={handleChange} placeholder="Reason for dropping (if applicable)"></textarea>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/enrollments')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Update Enrollment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEnrollment;