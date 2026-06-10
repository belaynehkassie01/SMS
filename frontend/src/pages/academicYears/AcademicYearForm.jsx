// pages/academicYears/AcademicYearForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAcademicYear } from '../../services/academicYearService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const AcademicYearForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/academic-years');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    year: '',
    semester: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.year?.trim()) newErrors.year = 'Academic year is required';
    if (!formData.semester?.trim()) newErrors.semester = 'Semester is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        Year: data.year,
        Semester: data.semester,
        StartDate: data.startDate || null,
        EndDate: data.endDate || null,
        IsActive: data.isActive ? 1 : 0,
      };
      return createAcademicYear(payload);
    },
    onSuccess: () => {
      success('Academic year created successfully');
      queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      navigate('/academic-years');
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Create failed');
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
            <i className="bi bi-calendar-plus me-2 text-primary"></i>
            Create New Academic Year
          </h2>
          <p className="text-secondary mb-0">Enter academic year and semester details</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/academic-years')}>
          ← Back
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body bg-white p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">
                  Academic Year <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="year"
                  className={`form-control bg-white text-dark ${errors.year ? 'is-invalid' : ''}`}
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="e.g., 2024/2025"
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.year && <div className="invalid-feedback">{errors.year}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">
                  Semester <span className="text-danger">*</span>
                </label>
                <select
                  name="semester"
                  className={`form-select bg-white text-dark ${errors.semester ? 'is-invalid' : ''}`}
                  value={formData.semester}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Semester</option>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Summer">Summer</option>
                </select>
                {errors.semester && <div className="invalid-feedback">{errors.semester}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control bg-white text-dark"
                  value={formData.startDate}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  className="form-control bg-white text-dark"
                  value={formData.endDate}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>

              <div className="col-md-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="isActive"
                    className="form-check-input"
                    checked={formData.isActive}
                    onChange={handleChange}
                    id="isActive"
                  />
                  <label className="form-check-label text-dark" htmlFor="isActive">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/academic-years')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Academic Year'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearForm;