// pages/teachers/TeacherDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTeacherById } from '../../services/teacherService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => getTeacherById(id),
    enabled: !!id,
  });

  console.log('Full response:', data);
  
  // Fix: Extract teacher from nested structure
  // Structure: data.data.data (where data is axios response, then backend response, then teacher object)
  const teacher = data?.data?.data || data?.data || {};
  
  console.log('Extracted teacher:', teacher);
  console.log('Teacher FirstName:', teacher.FirstName);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading teacher details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading teacher details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  // Format full name
  const fullName = teacher.FirstName && teacher.LastName 
    ? `${teacher.FirstName} ${teacher.LastName}` 
    : teacher.FirstName || teacher.LastName || 'N/A';

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return '-';
    return `ETB ${Number(salary).toLocaleString()}`;
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-person-badge me-2 text-primary"></i>
            Teacher Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete teacher information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/teachers/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button 
            className="btn btn-outline-secondary" 
            onClick={() => navigate('/teachers')}
          >
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Summary Card */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-person-circle fs-1 text-primary"></i>
              </div>
              <h4 className="mb-1 fw-semibold" style={{ color: '#1a1a2e' }}>{fullName}</h4>
              <p className="text-primary mb-2">Teacher ID: {teacher.TeacherID || '-'}</p>
              <span className="badge bg-success px-3 py-2">Active</span>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="col-md-8">
          {/* Personal Information */}
          <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="mb-0" style={{ color: '#495057' }}>
                <i className="bi bi-person-badge me-2 text-primary"></i>
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">First Name</label>
                  <span className="fw-semibold" style={{ color: '#212529' }}>{teacher.FirstName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Last Name</label>
                  <span className="fw-semibold" style={{ color: '#212529' }}>{teacher.LastName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary large mb-1 d-block">Gender</label>
                  <span style={{ color: '#212529' }}>{teacher.Gender || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Birth Date</label>
                  <span style={{ color: '#212529' }}>{formatDate(teacher.BirthDate)}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Email</label>
                  <span style={{ color: '#212529' }}>{teacher.Email || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Phone</label>
                  <span style={{ color: '#212529' }}>{teacher.Phone || '-'}</span>
                </div>
                <div className="col-12 mb-3">
                  <label className="text-primary small mb-1 d-block">Address</label>
                  <span style={{ color: '#212529' }}>{teacher.Address || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="mb-0" style={{ color: '#495057' }}>
                <i className="bi bi-briefcase me-2 text-success"></i>
                Professional Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Department</label>
                  <span style={{ color: '#212529' }}>{teacher.DeptName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Hire Date</label>
                  <span style={{ color: '#212529' }}>{formatDate(teacher.HireDate)}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Salary</label>
                  <span style={{ color: '#212529' }}>{formatSalary(teacher.Salary)}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Qualification</label>
                  <span style={{ color: '#212529' }}>{teacher.Qualification || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Specialization</label>
                  <span style={{ color: '#212229' }}>{teacher.Specialization || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;