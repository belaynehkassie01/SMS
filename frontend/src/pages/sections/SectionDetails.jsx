// pages/sections/SectionDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSectionById } from '../../services/sectionService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const SectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: ['section', id],
    queryFn: () => getSectionById(id),
    enabled: !!id,
  });

  console.log('Section details response:', data);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading section details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading section details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  const section = data?.data?.data || data?.data || {};

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>
            Section Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete section information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/sections/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/sections')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Section Info Card */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-grid-3x3-gap-fill fs-1 text-primary"></i>
              </div>
              <h3 className="mb-2 fw-semibold" style={{ color: '#1a1a2e' }}>{section.SectionName || 'N/A'}</h3>
              <hr className="my-3" />
              <div className="row">
                <div className="col-6">
                  <small className="text-black d-block">Capacity</small>
                  <span className="fw-bold fs-4" style={{ color: '#0d6efd' }}>{section.Capacity || '-'}</span>
                </div>
                <div className="col-6">
                  <small className="text-primary d-block">Status</small>
                  <span className={`badge ${section.Status === 'Active' ? 'bg-success' : 'bg-secondary'} mt-2`}>
                    {section.Status || 'Active'}
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
                Section Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Section ID</label>
                  <span className="fw-semibold" style={{ color: '#212529' }}>{section.SectionID || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Section Name</label>
                  <span style={{ color: '#212529' }}>{section.SectionName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Course ID</label>
                  <span style={{ color: '#212529' }}>{section.CourseID || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Course Name</label>
                  <span style={{ color: '#212529' }}>{section.CourseTitle || 'Not available'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Academic Year ID</label>
                  <span style={{ color: '#212529' }}>{section.AcademicYearID || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Year / Semester</label>
                  <span style={{ color: '#212529' }}>
                    {section.Year ? `${section.Year} - ${section.Semester || ''}` : section.Semester || '-'}
                  </span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Room Number</label>
                  <span style={{ color: '#212529' }}>{section.RoomNumber || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Schedule</label>
                  <span style={{ color: '#212529' }}>{section.Schedule || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Capacity</label>
                  <span style={{ color: '#212529' }}>{section.Capacity || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-primary small mb-1 d-block">Created Date</label>
                  <span style={{ color: '#212529' }}>
                    {section.CreatedAt ? new Date(section.CreatedAt).toLocaleDateString() : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Note about missing data */}
      {(!section.CourseTitle || !section.Year) && (
        <div className="alert alert-warning mt-3">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Note:</strong> Course name and Year/Semester are not showing because your backend needs to join the Course and AcademicYear tables in the getSectionById query.
        </div>
      )}
    </div>
  );
};

export default SectionDetails;