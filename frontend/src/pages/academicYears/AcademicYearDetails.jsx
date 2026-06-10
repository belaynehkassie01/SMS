// pages/academicYears/AcademicYearDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAcademicYearById } from '../../services/academicYearService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const AcademicYearDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: ['academicYear', id],
    queryFn: () => getAcademicYearById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading academic year details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading academic year details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  const academicYear = data?.data?.data || data?.data || {};

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-calendar-event me-2 text-primary"></i>
            Academic Year Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete academic year information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/academic-years/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/academic-years')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Academic Year Info Card */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-calendar-week fs-1 text-primary"></i>
              </div>
              <h3 className="mb-1 fw-semibold" style={{ color: '#1a1a2e' }}>{academicYear.Year || 'N/A'}</h3>
              <p className="mb-2" style={{ color: '#6c757d' }}>{academicYear.Semester || 'N/A'}</p>
              <hr className="my-3" />
              <div className="row">
                <div className="col-12">
                  <small className="d-block" style={{ color: '#6c757d' }}>Status</small>
                  <div className="mt-1">
                    <span className={`badge ${academicYear.IsActive === 1 || academicYear.IsActive === true ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
                      {academicYear.IsActive === 1 || academicYear.IsActive === true ? 'Active' : 'Inactive'}
                    </span>
                  </div>
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
                Academic Year Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Academic Year ID</label>
                  <div className="fw-semibold" style={{ color: '#212529' }}>{academicYear.AcademicYearID || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Academic Year</label>
                  <div style={{ color: '#212529' }}>{academicYear.Year || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Semester</label>
                  <div style={{ color: '#212529' }}>{academicYear.Semester || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Start Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(academicYear.StartDate)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>End Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(academicYear.EndDate)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Created Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(academicYear.CreatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicYearDetails;