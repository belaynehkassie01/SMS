// pages/attendance/AttendanceDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAttendanceById } from '../../services/attendanceService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const AttendanceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: ['attendance', id],
    queryFn: () => getAttendanceById(id),
    enabled: !!id,
  });

  console.log('Attendance details response:', data);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading attendance details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading attendance details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  const attendance = data?.data?.data || data?.data || {};

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'Present') return 'bg-success';
    if (status === 'Absent') return 'bg-danger';
    if (status === 'Late') return 'bg-warning text-dark';
    return 'bg-secondary';
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-calendar-check me-2 text-primary"></i>
            Attendance Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete attendance record</p>
        </div>
        <div className="d-flex gap-2">
          {(user?.role === 'Admin' || user?.role === 'Teacher') && (
            <Link to={`/attendance/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/attendance')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Attendance Info Card */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-calendar-check fs-1 text-primary"></i>
              </div>
              <h3 className="mb-1 fw-semibold" style={{ color: '#1a1a2e' }}>
                {attendance.FirstName} {attendance.LastName}
              </h3>
              <p className="mb-2" style={{ color: '#6c757d' }}>Student ID: {attendance.StudentNumber || '-'}</p>
              <hr className="my-3" />
              <div className="row">
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Date</small>
                  <div className="fw-bold fs-5" style={{ color: '#0d6efd' }}>{formatDate(attendance.Date)}</div>
                </div>
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Status</small>
                  <div className="mt-1">
                    <span className={`badge ${getStatusBadgeColor(attendance.Status)} px-3 py-2`}>
                      {attendance.Status || '-'}
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
                Attendance Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Attendance ID</label>
                  <div className="fw-semibold" style={{ color: '#212529' }}>{attendance.AttendanceID || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Student Name</label>
                  <div style={{ color: '#212529' }}>{`${attendance.FirstName || ''} ${attendance.LastName || ''}`.trim() || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Student Number</label>
                  <div style={{ color: '#212529' }}>{attendance.StudentNumber || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Section</label>
                  <div style={{ color: '#212529' }}>{attendance.SectionName || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(attendance.Date)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Status</label>
                  <div style={{ color: '#212529' }}>{attendance.Status || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Check In Time</label>
                  <div style={{ color: '#212529' }}>{attendance.CheckInTime || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Check Out Time</label>
                  <div style={{ color: '#212529' }}>{attendance.CheckOutTime || '-'}</div>
                </div>
                <div className="col-12 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Remarks</label>
                  <div style={{ color: '#212529' }}>{attendance.Remarks || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Created Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(attendance.CreatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDetails;