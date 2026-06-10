// pages/exams/ExamDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getExamById } from '../../services/examService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const ExamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  const { data, isLoading, error } = useQuery({
    queryKey: ['exam', id],
    queryFn: () => getExamById(id),
    enabled: !!id,
  });

  console.log('Exam details response:', data);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading exam details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading exam details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  // Handle different response structures
  const exam = data?.data?.data || data?.data || {};

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
            <i className="bi bi-file-text me-2 text-primary"></i>
            Exam Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete exam information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/exams/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/exams')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Exam Info Card */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-file-text fs-1 text-primary"></i>
              </div>
              <h3 className="mb-1 fw-semibold" style={{ color: '#1a1a2e' }}>{exam.ExamName || 'N/A'}</h3>
              <hr className="my-3" />
              <div className="row">
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Max Marks</small>
                  <div className="fw-bold fs-4" style={{ color: '#0d6efd' }}>{exam.MaxMarks || '-'}</div>
                </div>
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Weightage</small>
                  <div className="fw-bold fs-4" style={{ color: '#198754' }}>{exam.Weightage ? `${exam.Weightage}%` : '-'}</div>
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
                Exam Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Exam ID</label>
                  <div className="fw-semibold" style={{ color: '#212529' }}>{exam.ExamID || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Exam Name</label>
                  <div style={{ color: '#212529' }}>{exam.ExamName || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Section</label>
                  <div style={{ color: '#212529' }}>{exam.SectionName || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Course</label>
                  <div style={{ color: '#212529' }}>{exam.CourseTitle || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Exam Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(exam.ExamDate)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Max Marks</label>
                  <div style={{ color: '#212529' }}>{exam.MaxMarks || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Weightage</label>
                  <div style={{ color: '#212529' }}>{exam.Weightage ? `${exam.Weightage}%` : '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Section ID</label>
                  <div style={{ color: '#212529' }}>{exam.SectionID || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Created Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(exam.CreatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;