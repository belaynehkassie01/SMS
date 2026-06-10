// pages/departments/EditDepartment.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDepartmentById, updateDepartment } from '../../services/departmentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/departments');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    deptCode: '',
    deptName: '',
    headOfDept: '',
    phone: '',
    location: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  const { data: deptResponse, isLoading: loadingDept } = useQuery({
    queryKey: ['department', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (deptResponse?.data) {
      const d = deptResponse.data;
      setFormData({
        deptCode: d.DeptCode || '',
        deptName: d.DeptName || '',
        headOfDept: d.HeadOfDept || '',
        phone: d.Phone || '',
        location: d.Location || '',
        isActive: d.IsActive === 1 || d.IsActive === true,
      });
    }
  }, [deptResponse]);

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
    if (!formData.deptCode?.trim()) newErrors.deptCode = 'Department code is required';
    if (!formData.deptName?.trim()) newErrors.deptName = 'Department name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        DeptCode: data.deptCode,
        DeptName: data.deptName,
        HeadOfDept: data.headOfDept || null,
        Phone: data.phone || null,
        Location: data.location || null,
        IsActive: data.isActive ? 1 : 0,
      };
      console.log('📤 Updating department with payload:', payload);
      return updateDepartment(id, payload);
    },
    onSuccess: () => {
      success('Department updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      queryClient.invalidateQueries({ queryKey: ['department', id] });
      navigate('/departments');
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

  const isLoading = loadingDept || updateMutation.isLoading;

  if (loadingDept) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading department data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit Department
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Update department information</p>
        </div>
        <button className="btn px-4 py-2" onClick={() => navigate('/departments')} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Department Code <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="deptCode" 
                  className={`form-control bg-white text-dark ${errors.deptCode ? 'is-invalid' : ''}`} 
                  value={formData.deptCode} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.deptCode && <div className="invalid-feedback">{errors.deptCode}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Department Name <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  name="deptName" 
                  className={`form-control bg-white text-dark ${errors.deptName ? 'is-invalid' : ''}`} 
                  value={formData.deptName} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.deptName && <div className="invalid-feedback">{errors.deptName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Head of Department</label>
                <input 
                  type="text" 
                  name="headOfDept" 
                  className="form-control bg-white text-dark" 
                  value={formData.headOfDept} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="form-control bg-white text-dark" 
                  value={formData.phone} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  className="form-control bg-white text-dark" 
                  value={formData.location} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Status</label>
                <div className="form-check mt-2">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    className="form-check-input" 
                    checked={formData.isActive} 
                    onChange={handleChange}
                    style={{ cursor: 'pointer' }}
                  />
                  <label className="form-check-label" style={{ color: '#212529' }}>
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button type="button" className="btn px-4 py-2" onClick={() => navigate('/departments')} disabled={isLoading} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}>Cancel</button>
              <button type="submit" className="btn px-4 py-2" disabled={isLoading} style={{ backgroundColor: '#0d6efd', color: '#ffffff', border: 'none' }}>
                {isLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Update Department'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDepartment;