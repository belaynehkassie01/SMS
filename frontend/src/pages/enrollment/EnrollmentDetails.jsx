// pages/enrollments/EnrollmentDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEnrollmentById } from '../../services/enrollmentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EnrollmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: ['enrollment', id],
    queryFn: () => getEnrollmentById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading enrollment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading enrollment details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  const enrollment = data?.data?.data || data?.data || {};

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
            <i className="bi bi-journal-check me-2 text-primary"></i>
            Enrollment Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete enrollment information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/enrollments/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/enrollments')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Student Info Card */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-person-check fs-1 text-primary"></i>
              </div>
              <h3 className="mb-1 fw-semibold" style={{ color: '#1a1a2e' }}>
                {enrollment.FirstName} {enrollment.LastName}
              </h3>
              <p className="mb-2" style={{ color: '#6c757d' }}>
                Student ID: {enrollment.StudentNumber || '-'}
              </p>
              <hr className="my-3" />
              <div className="row">
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Status</small>
                  <div className="mt-1">
                    <span className={`badge ${enrollment.Status === 'Enrolled' ? 'bg-success' : 'bg-danger'} px-3 py-2`}>
                      {enrollment.Status || 'Enrolled'}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Enrollment Date</small>
                  <div className="fw-semibold mt-1" style={{ color: '#212529' }}>
                    {formatDate(enrollment.EnrollmentDate)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course & Section Info Card */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="mb-0" style={{ color: '#495057' }}>
                <i className="bi bi-book me-2 text-primary"></i>
                Course & Section Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Enrollment ID</label>
                  <div className="fw-semibold" style={{ color: '#212529' }}>{enrollment.EnrollmentID || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Course</label>
                  <div style={{ color: '#212529' }}>{enrollment.CourseTitle || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Section</label>
                  <div style={{ color: '#212529' }}>{enrollment.SectionName || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Student Number</label>
                  <div style={{ color: '#212529' }}>{enrollment.StudentNumber || '-'}</div>
                </div>
                {enrollment.DropDate && (
                  <div className="col-sm-6 mb-3">
                    <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Drop Date</label>
                    <div style={{ color: '#212529' }}>{formatDate(enrollment.DropDate)}</div>
                  </div>
                )}
                {enrollment.DropReason && (
                  <div className="col-12 mb-3">
                    <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Drop Reason</label>
                    <div style={{ color: '#212529' }}>{enrollment.DropReason}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="mb-0" style={{ color: '#495057' }}>
                <i className="bi bi-info-circle me-2 text-info"></i>
                Additional Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Created Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(enrollment.CreatedAt)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Last Updated</label>
                  <div style={{ color: '#212529' }}>{formatDate(enrollment.UpdatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDetails;