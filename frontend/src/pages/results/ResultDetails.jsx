// pages/results/ResultDetails.jsx
import React, { useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getResultById } from '../../services/resultService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';
import CertificateModal from '../../components/common/CertificateModal';

const ResultDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();
  const [showCertificate, setShowCertificate] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['result', id],
    queryFn: () => getResultById(id),
    enabled: !!id,
  });

  console.log('Result details response:', data);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading result details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading result details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  const result = data?.data?.data || data?.data || {};

  console.log('Extracted result:', result);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  const getGradeBadgeColor = (grade) => {
    if (!grade) return 'bg-secondary';
    const upperGrade = grade.toUpperCase();
    if (upperGrade.startsWith('A')) return 'bg-success';
    if (upperGrade.startsWith('B')) return 'bg-info';
    if (upperGrade.startsWith('C')) return 'bg-warning text-dark';
    if (upperGrade.startsWith('D')) return 'bg-warning text-dark';
    return 'bg-danger';
  };

  const getGradeMessage = (grade) => {
    if (!grade) return 'Result Published';
    const upperGrade = grade.toUpperCase();
    if (upperGrade.startsWith('A')) return 'Excellent Performance!';
    if (upperGrade.startsWith('B')) return 'Very Good Performance!';
    if (upperGrade.startsWith('C')) return 'Good Performance';
    if (upperGrade.startsWith('D')) return 'Satisfactory';
    return 'Need Improvement';
  };

  const studentName = `${result.FirstName || ''} ${result.LastName || ''}`.trim() || 'Student';
  const examName = result.ExamName || 'Examination';
  const obtainedMarks = result.ObtainedMarks || 0;
  const maxMarks = result.MaxMarks || 100;
  const grade = result.Grade || 'N/A';
  const message = getGradeMessage(grade);
  // Calculate GPA or use from backend (default 3.5 for demo)
  const gpa = result.GPA || ((obtainedMarks / maxMarks) * 4).toFixed(2);

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-trophy me-2 text-primary"></i>
            Result Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete exam result information</p>
        </div>
        <div className="d-flex gap-2">
          {(user?.role === 'Admin' || user?.role === 'Teacher') && (
            <>
              <button 
                onClick={() => setShowCertificate(true)}
                className="btn btn-success"
              >
                <i className="bi bi-award me-2"></i>View Certificate
              </button>
              <Link to={`/results/edit/${id}`} className="btn btn-primary">
                <i className="bi bi-pencil me-2"></i>Edit
              </Link>
            </>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/results')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Result Info Card - Now showing GPA prominently */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-trophy fs-1 text-primary"></i>
              </div>
              {/* GPA - Prominently displayed instead of exam name */}
              <div className="mb-2">
                <small className="d-block" style={{ color: '#6c757d' }}>CUMULATIVE GPA</small>
                <div className="fw-bold fs-1" style={{ color: '#1a4731' }}>
                  {gpa}
                </div>
                <small style={{ color: '#6c757d' }}>Scale: 4.0</small>
              </div>
              <p className="mb-2" style={{ color: '#6c757d' }}>{studentName}</p>
              <p className="mb-2" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                Student ID: {result.StudentNumber || '-'}
              </p>
              <hr className="my-3" />
              <div className="row">
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Obtained Marks</small>
                  <div className="fw-bold fs-4" style={{ color: '#0d6efd' }}>
                    {obtainedMarks} / {maxMarks}
                  </div>
                </div>
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Grade</small>
                  <div className="mt-1">
                    <span className={`badge ${getGradeBadgeColor(grade)} px-3 py-2 fs-6`}>
                      {grade}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <small className="d-block" style={{ color: '#6c757d' }}>Percentage</small>
                <div className="fw-bold" style={{ color: '#198754' }}>
                  {((obtainedMarks / maxMarks) * 100).toFixed(1)}%
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
                Result Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Result ID</label>
                  <div className="fw-semibold" style={{ color: '#212529' }}>{result.ResultID || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Student Name</label>
                  <div style={{ color: '#212529' }}>{studentName}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Student Number</label>
                  <div style={{ color: '#212529' }}>{result.StudentNumber || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Exam Name</label>
                  <div style={{ color: '#212529' }}>{examName}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Section</label>
                  <div style={{ color: '#212529' }}>{result.SectionName || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Course</label>
                  <div style={{ color: '#212529' }}>{result.CourseTitle || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Enrollment Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(result.EnrollmentDate)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Max Marks</label>
                  <div style={{ color: '#212529' }}>{maxMarks || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Obtained Marks</label>
                  <div style={{ color: '#212529' }}>{obtainedMarks || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Percentage</label>
                  <div style={{ color: '#212529' }}>{((obtainedMarks / maxMarks) * 100).toFixed(1)}%</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>GPA</label>
                  <div className="fw-bold" style={{ color: '#1a4731' }}>{gpa}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Grade</label>
                  <div style={{ color: '#212529' }}>{grade}</div>
                </div>
                <div className="col-12 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Remarks</label>
                  <div style={{ color: '#212529' }}>{result.Remarks || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Created Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(result.CreatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        show={showCertificate}
        onClose={() => setShowCertificate(false)}
        studentName={studentName}
        studentId={result.StudentNumber}
        examName={examName}
        obtainedMarks={obtainedMarks}
        maxMarks={maxMarks}
        grade={grade}
        percentage={((obtainedMarks / maxMarks) * 100).toFixed(1)}
        gpa={gpa}
        year={result.Year || '2024/2025'}
        message={message}
        date={new Date().toLocaleDateString()}
      />
    </div>
  );
};

export default ResultDetails;