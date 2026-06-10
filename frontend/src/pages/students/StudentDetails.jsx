// pages/students/StudentDetails.jsx
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudentById } from '../../services/studentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();

  console.log('Student ID from URL:', id);

  const { data, isLoading, error } = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudentById(id),
    enabled: !!id, // Only run if id exists
  });

  console.log('Raw API response:', data);
  console.log('Response status:', data?.status);
  console.log('Response data:', data?.data);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading student data for ID: {id}...</p>
      </div>
    );
  }

  if (error) {
    console.error('Error details:', error);
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading student details: {error?.response?.data?.message || error.message}
        <div className="mt-2 small">
          Status: {error?.response?.status}<br />
          ID: {id}
        </div>
      </div>
    );
  }

  // Try to extract student data from different possible response structures
  const student = data?.data?.data || data?.data || data || {};
  
  console.log('Extracted student object:', student);
  console.log('Student has FirstName?', student.FirstName);
  console.log('Student has StudentNumber?', student.StudentNumber);

  // Check if we have valid student data
  if (!student.StudentID && !student.StudentNumber && !student.FirstName) {
    return (
      <div className="container py-3">
        <div className="alert alert-warning m-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No student data found. The student might not exist.
          <div className="mt-2 small">
            ID requested: {id}<br />
            Response status: {data?.status}<br />
            Response data: <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/students')}>
          Back to Students
        </button>
      </div>
    );
  }

  // Format full name
  const fullName = `${student.FirstName || ''} ${student.LastName || ''}`.trim() || 'N/A';
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  return (
    <div className="container py-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 text-dark">
            <i className="bi bi-person-vcard me-2 text-primary"></i>
            Student Details
          </h2>
          <p className="text-secondary mb-0 mt-1">View complete student information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <Link to={`/students/edit/${id}`} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Edit
            </Link>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/students')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Summary Card */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center p-4">
              <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-person-circle fs-1 text-primary"></i>
              </div>
              <h4 className="mb-1">{fullName}</h4>
              <p className="text-muted mb-2">{student.StudentNumber || '-'}</p>
              <span className={`badge ${student.Status === 'Active' ? 'bg-success' : 'bg-secondary'} px-3 py-2`}>
                {student.Status || 'Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="col-md-8">
          {/* Personal Information */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="bi bi-person-badge me-2 text-primary"></i>
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">First Name</label>
                  <span className="fw-semibold">{student.FirstName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Last Name</label>
                  <span className="fw-semibold">{student.LastName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Gender</label>
                  <span>{student.Gender || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Birth Date</label>
                  <span>{formatDate(student.BirthDate)}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Email</label>
                  <span>{student.Email || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Phone</label>
                  <span>{student.Phone || '-'}</span>
                </div>
                <div className="col-12 mb-3">
                  <label className="text-muted small mb-1 d-block">Address</label>
                  <span>{student.Address || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
              <h5 className="mb-0">
                <i className="bi bi-book me-2 text-success"></i>
                Academic Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Student Number</label>
                  <span className="fw-semibold">{student.StudentNumber || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Department</label>
                  <span>{student.DepartmentName || student.DeptName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Section</label>
                  <span>{student.SectionName || '-'}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Enrollment Date</label>
                  <span>{formatDate(student.EnrollmentDate)}</span>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="text-muted small mb-1 d-block">Status</label>
                  <span className={`badge ${student.Status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                    {student.Status || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guardian Information */}
          {(student.GuardianName || student.GuardianPhone || student.GuardianEmail) && (
            <div className="card shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">
                  <i className="bi bi-person-heart me-2 text-warning"></i>
                  Guardian Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-6 mb-3">
                    <label className="text-muted small mb-1 d-block">Guardian Name</label>
                    <span>{student.GuardianName || '-'}</span>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label className="text-muted small mb-1 d-block">Guardian Phone</label>
                    <span>{student.GuardianPhone || '-'}</span>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <label className="text-muted small mb-1 d-block">Guardian Email</label>
                    <span>{student.GuardianEmail || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;