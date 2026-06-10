// src/pages/teaches/TeachesDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTeachById } from '../../services/teachesService';
import { useAuth } from '../../hooks/useAuth';

const TeachesDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  
  // Try to get assignment from location state first
  const [assignment, setAssignment] = useState(location.state?.assignment || null);
  const [loading, setLoading] = useState(!assignment);

  console.log('Location state:', location.state);
  console.log('Assignment from state:', assignment);

  // If no data from state, fetch from API
  const { data, isLoading, error } = useQuery({
    queryKey: ['teaches', id],
    queryFn: () => getTeachById(id),
    enabled: !assignment && !!id,  // Only fetch if no assignment from state
  });

  useEffect(() => {
    if (data?.data && !assignment) {
      setAssignment(data.data);
      setLoading(false);
    }
  }, [data, assignment]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading || (!assignment && isLoading)) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Error loading assignment: {error?.response?.data?.message || error.message}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/teaches')}>
          Back to List
        </button>
      </div>
    );
  }

  if (!assignment || Object.keys(assignment).length === 0) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No assignment data available.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/teaches')}>
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-person-badge me-2 text-primary"></i>
            Assignment Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>
            View complete teacher assignment information
          </p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/teaches/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/teaches')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      {/* Details Card */}
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="border-bottom pb-2 mb-2">
                <h5 className="mb-0" style={{ color: '#0d6efd' }}>
                  <i className="bi bi-hash me-2"></i>Assignment Information
                </h5>
              </div>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: '150px', color: '#6c757d' }}>Assignment ID:</th>
                    <td style={{ color: '#white' }}>{assignment.TeachesID || '-'}</td>
                  </tr>
                  <tr>
                    <th style={{ color: '#6c757d' }}>Created Date:</th>
                    <td style={{ color: '#white' }}>{formatDate(assignment.CreatedAt)}</td>
                  </tr>
                  <tr>
                    <th style={{ color: '#6c757d' }}>Last Updated:</th>
                    <td style={{ color: '#white' }}>{formatDate(assignment.UpdatedAt)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6 mb-4">
              <div className="border-bottom pb-2 mb-2">
                <h5 className="mb-0" style={{ color: '#0d6efd' }}>
                  <i className="bi bi-person me-2"></i>Teacher Information
                </h5>
              </div>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: '150px', color: '#6c757d' }}>Teacher ID:</th>
                    <td style={{ color: '#white' }}>{assignment.TeacherID || '-'}</td>
                  </tr>
                  <tr>
                    <th style={{ color: '#6c757d' }}>Teacher Name:</th>
                    <td style={{ color: '#white', fontWeight: '500' }}>
                      {assignment.FirstName} {assignment.LastName}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6 mb-4">
              <div className="border-bottom pb-2 mb-2">
                <h5 className="mb-0" style={{ color: '#0d6efd' }}>
                  <i className="bi bi-book me-2"></i>Course Information
                </h5>
              </div>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: '150px', color: '#6c757d' }}>Course ID:</th>
                    <td style={{ color: '#white' }}>{assignment.CourseID || '-'}</td>
                  </tr>
                  <tr>
                    <th style={{ color: '#6c757d' }}>Course Title:</th>
                    <td style={{ color: '#white', fontWeight: '500' }}>{assignment.CourseTitle || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6 mb-4">
              <div className="border-bottom pb-2 mb-2">
                <h5 className="mb-0" style={{ color: '#0d6efd' }}>
                  <i className="bi bi-grid me-2"></i>Section Information
                </h5>
              </div>
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <th style={{ width: '150px', color: '#6c757d' }}>Section ID:</th>
                    <td style={{ color: '#white' }}>{assignment.SectionID || '-'}</td>
                  </tr>
                  <tr>
                    <th style={{ color: '#6c757d' }}>Section Name:</th>
                    <td style={{ color: '#white', fontWeight: '500' }}>{assignment.SectionName || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-12 mb-4">
              <div className="border-bottom pb-2 mb-2">
                <h5 className="mb-0" style={{ color: '#0d6efd' }}>
                  <i className="bi bi-star me-2"></i>Assignment Status
                </h5>
              </div>
              <div className="mt-2">
                {assignment.IsPrimaryTeacher === 1 ? (
                  <span className="badge bg-success fs-6 px-3 py-2">Primary Teacher</span>
                ) : (
                  <span className="badge bg-secondary fs-6 px-3 py-2">Secondary Teacher</span>
                )}
                <p className="mt-2 mb-0 text-muted small">
                  {assignment.IsPrimaryTeacher === 1 
                    ? 'This teacher is the primary instructor for this section and has full access.'
                    : 'This teacher is a secondary/assistant teacher for this section.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-4 d-flex justify-content-end gap-2">
        {user?.role === 'Admin' && (
          <Link to={`/teaches/edit/${id}`} className="btn btn-primary">
            <i className="bi bi-pencil me-2"></i>Edit Assignment
          </Link>
        )}
        <button className="btn btn-outline-secondary" onClick={() => navigate('/teaches')}>
          <i className="bi bi-arrow-left me-2"></i>Back to List
        </button>
      </div>
    </div>
  );
};

export default TeachesDetails;