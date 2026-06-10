// pages/courses/EditCourse.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourseById, updateCourse } from '../../services/courseService';
import { getDepartments } from '../../services/departmentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/courses');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    courseCode: '',
    title: '',
    credits: '',
    description: '',
    departmentId: '',
  });

  const [errors, setErrors] = useState({});

  // FETCH COURSE DATA
  const { data: courseResponse, isLoading: loadingCourse } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });

  // FETCH DEPARTMENTS
  const { data: deptsResponse, isLoading: loadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const departments = deptsResponse?.data?.data || deptsResponse?.data || [];

  // POPULATE FORM
  useEffect(() => {
    if (courseResponse?.data) {
      const c = courseResponse.data;
      setFormData({
        courseCode: c.CourseCode || '',
        title: c.Title || '',
        credits: c.Credits || '',
        description: c.Description || '',
        departmentId: c.DeptID || '',
      });
    }
  }, [courseResponse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.courseCode?.trim()) newErrors.courseCode = 'Course code is required';
    if (!formData.title?.trim()) newErrors.title = 'Course title is required';
    if (!formData.credits) newErrors.credits = 'Credits are required';
    if (formData.credits && (formData.credits < 1 || formData.credits > 6)) {
      newErrors.credits = 'Credits must be between 1 and 6';
    }
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        CourseCode: data.courseCode,
        Title: data.title,
        Credits: parseInt(data.credits),
        Description: data.description || null,
        DeptID: parseInt(data.departmentId),
      };
      console.log('📤 Updating course with payload:', payload);
      return updateCourse(id, payload);
    },
    onSuccess: () => {
      success('Course updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      navigate('/courses');
    },
    onError: (err) => {
      console.error('Update error:', err);
      notifyError(err?.response?.data?.message || 'Update failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateMutation.mutate(formData);
  };

  const isLoading = loadingCourse || updateMutation.isLoading;

  if (loadingCourse) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading course data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit Course
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Update course information</p>
        </div>
        <button className="btn px-4 py-2" onClick={() => navigate('/courses')} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Course Code <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                    name="courseCode" 
                  className={`form-control bg-white text-dark ${errors.courseCode ? 'is-invalid' : ''}`} 
                  value={formData.courseCode} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.courseCode && <div className="invalid-feedback">{errors.courseCode}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Credits <span className="text-danger">*</span>
                </label>
                <input 
                  type="number" 
                  name="credits" 
                  className={`form-control bg-white text-dark ${errors.credits ? 'is-invalid' : ''}`} 
                  value={formData.credits} 
                  onChange={handleChange}
                  min="1"
                  max="6"
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.credits && <div className="invalid-feedback">{errors.credits}</div>}
              </div>

              <div className="col-12">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Course Title <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="title" 
                  className={`form-control bg-white text-dark ${errors.title ? 'is-invalid' : ''}`} 
                  value={formData.title} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Department <span className="text-danger">*</span>
                </label>
                <select 
                  name="departmentId" 
                  className={`form-select bg-white text-dark ${errors.departmentId ? 'is-invalid' : ''}`} 
                  value={formData.departmentId} 
                  onChange={handleChange} 
                  disabled={loadingDepts}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.DeptID || d.id} value={d.DeptID || d.id}>
                      {d.DeptName || d.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && <div className="invalid-feedback">{errors.departmentId}</div>}
              </div>

              <div className="col-12">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Description</label>
                <textarea 
                  name="description" 
                  className="form-control bg-white text-dark" 
                  rows="4" 
                  value={formData.description} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                ></textarea>
              </div>
            </div>

            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button type="button" className="btn px-4 py-2" onClick={() => navigate('/courses')} disabled={isLoading} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}>Cancel</button>
              <button type="submit" className="btn px-4 py-2" disabled={isLoading} style={{ backgroundColor: '#0d6efd', color: '#ffffff', border: 'none' }}>
                {isLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Update Course'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;