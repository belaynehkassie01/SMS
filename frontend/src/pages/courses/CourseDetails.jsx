// pages/courses/CourseDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourseById } from '../../services/courseService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });

  console.log('Full API Response:', data);
  console.log('data?.data:', data?.data);

  // Extract course from nested response structure
  // Your response structure: { data: { success: true, data: {...} } }
  const course = data?.data?.data || data?.data || {};
  
  console.log('Extracted course:', course);
  console.log('Course Code:', course.CourseCode);
  console.log('Course Title:', course.Title);
  console.log('DeptName:', course.DeptName);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading course details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading course details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  // If no course data, show message
  if (!course.CourseID && !course.CourseCode) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Course not found or no data available.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/courses')}>
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-book me-2 text-primary"></i>
            Course Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete course information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/courses/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/courses')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Course Info Card */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-journal-bookmark-fill fs-1 text-primary"></i>
              </div>
              <h3 className="mb-2 fw-semibold" style={{ color: '#1a1a2e' }}>{course.CourseCode || 'N/A'}</h3>
              <p className="text-secondary mb-0">{course.Title || 'No title'}</p>
              <hr className="my-3" />
              <div className="row">
                <div className="col-6">
                  <small className="text-black d-block">Credits</small>
                  <span className="fw-bold fs-4" style={{ color: '#0d6efd' }}>{course.Credits || '-'}</span>
                </div>
                <div className="col-6">
                  <small className="text-black d-block">Department</small>
                  <span className="fw-bold" style={{ color: '#198754' }}>{course.DeptName || '-'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="mb-0" style={{ color: '#495057' }}>
                <i className="bi bi-file-text me-2 text-primary"></i>
                Course Description
              </h5>
            </div>
            <div className="card-body">
              <p style={{ color: '#212529', lineHeight: '1.6' }}>
                {course.Description || 'No description available for this course.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
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
                <div className="col-md-6">
                  <label className="text-black small mb-1 d-block">Course ID</label>
                  <span className="fw-semibold" style={{ color: '#212529' }}>{course.CourseID || '-'}</span>
                </div>
                <div className="col-md-6">
                  <label className="text-black small mb-1 d-block">Status</label>
                  <span className="badge bg-success">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default CourseDetails;