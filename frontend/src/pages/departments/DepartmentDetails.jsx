// pages/departments/DepartmentDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDepartmentById } from '../../services/departmentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: ['department', id],
    queryFn: () => getDepartmentById(id),
    enabled: !!id,
  });

  console.log('Department details response:', data);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-primary ms-2">Loading department details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading department details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  const department = data?.data?.data || data?.data || {};

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-building me-2 text-primary"></i>
            Department Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete department information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/departments/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/departments')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Department Info Card */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-building fs-1 text-primary"></i>
              </div>
              <h3 className="mb-2 fw-semibold" style={{ color: '#1a1a2e' }}>{department.DeptName || 'N/A'}</h3>
              <hr className="my-3" />
              <div className="row">
                <div className="col-12">
                  <large className="text-primary d-block">Status</large>
                  <span className={`badge ${department.IsActive === 1 || department.IsActive === true ? 'bg-success' : 'bg-secondary'} px-3 py-2 mt-1`}>
                    {department.IsActive === 1 || department.IsActive === true ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="mb-0" style={{ color: '#495057' }}>
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Department Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="text-primary large mb-1 d-block">Department ID</label>
                  <span className="fw-semibold" style={{ color: '#212529' }}>{department.DeptID || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary large mb-1 d-block">Department Name</label>
                  <span style={{ color: '#212529' }}>{department.DeptName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary large mb-1 d-block">Head of Department</label>
                  <span style={{ color: '#212529' }}>{department.HeadOfDept || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary large mb-1 d-block">Phone</label>
                  <span style={{ color: '#212529' }}>{department.Phone || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary large mb-1 d-block">Location</label>
                  <span style={{ color: '#212529' }}>{department.Location || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary large mb-1 d-block">Created Date</label>
                  <span style={{ color: '#212529' }}>
                    {department.CreatedAt ? new Date(department.CreatedAt).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;