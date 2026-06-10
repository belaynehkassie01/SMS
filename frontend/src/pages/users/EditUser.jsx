// pages/users/EditUser.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, updateUser, getRoles } from '../../services/userService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/users');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    username: '',
    roleId: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  // Fetch user data
  const { data: userResponse, isLoading: loadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });

  // Fetch roles
  const { data: rolesResponse, isLoading: loadingRoles, error: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  // Debug logs
  console.log('Roles Response:', rolesResponse);
  console.log('Roles Error:', rolesError);

  // Extract roles array from response
  let roles = [];
  if (rolesResponse?.data && Array.isArray(rolesResponse.data)) {
    roles = rolesResponse.data;
  } else if (rolesResponse?.data?.data && Array.isArray(rolesResponse.data.data)) {
    roles = rolesResponse.data.data;
  }
  
  console.log('Extracted Roles:', roles);

  useEffect(() => {
    if (userResponse?.data) {
      const u = userResponse.data;
      console.log('User data:', u);
      setFormData({
        username: u.Username || '',
        roleId: u.RoleID || '',
        isActive: u.IsActive === 1,
      });
    }
  }, [userResponse]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username?.trim()) newErrors.username = 'Username is required';
    if (formData.username && formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.roleId) newErrors.roleId = 'Role is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        Username: data.username,
        RoleID: parseInt(data.roleId),
        IsActive: data.isActive ? 1 : 0,
      };
      console.log('Update payload:', payload);
      return updateUser(id, payload);
    },
    onSuccess: () => {
      success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate('/users');
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

  const isLoading = loadingUser || updateMutation.isLoading;

  if (loadingUser) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit User
          </h2>
          <p className="text-secondary mb-0">Update user account information</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/users')}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body bg-white p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold text-dark">
                  Username <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  className={`form-control bg-white text-dark ${errors.username ? 'is-invalid' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-dark">
                  Role <span className="text-danger">*</span>
                </label>
                {loadingRoles ? (
                  <div className="d-flex align-items-center gap-2">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-muted">Loading roles...</span>
                  </div>
                ) : rolesError ? (
                  <div className="alert alert-danger py-2 mb-0">
                    Failed to load roles. Please refresh.
                  </div>
                ) : roles.length === 0 ? (
                  <div className="alert alert-warning py-2 mb-0">
                    No roles found. Please check database.
                  </div>
                ) : (
                  <select
                    name="roleId"
                    className={`form-select bg-white text-dark ${errors.roleId ? 'is-invalid' : ''}`}
                    value={formData.roleId}
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  >
                    <option value="">Select a role</option>
                    {roles.map((r) => (
                      <option key={r.RoleID} value={r.RoleID}>
                        {r.RoleName}
                      </option>
                    ))}
                  </select>
                )}
                {errors.roleId && <div className="invalid-feedback">{errors.roleId}</div>}
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
                    Active Account
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/users')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Update User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;