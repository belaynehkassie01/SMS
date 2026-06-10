// pages/enrollments/EnrollmentList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEnrollments, deleteEnrollment } from '../../services/enrollmentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EnrollmentList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => getEnrollments(),
  });

  // Extract enrollments from response
  let enrollments = [];
  if (data?.data && Array.isArray(data?.data)) {
    enrollments = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    enrollments = data.data.data;
  } else if (Array.isArray(data)) {
    enrollments = data;
  }

  // Filter enrollments based on search
  useEffect(() => {
    if (enrollments.length > 0) {
      if (search.trim() === '') {
        setFilteredEnrollments(enrollments);
      } else {
        const filtered = enrollments.filter(enrollment =>
          (enrollment.FirstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (enrollment.LastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (enrollment.StudentNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (enrollment.CourseTitle?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (enrollment.SectionName?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredEnrollments(filtered);
      }
    } else {
      setFilteredEnrollments([]);
    }
  }, [search, enrollments]);

  const deleteMutation = useMutation({
    mutationFn: deleteEnrollment,
    onSuccess: async () => {
      success('Enrollment deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete enrollment');
    },
  });

  const handleDelete = (id, studentName) => {
    if (window.confirm(`Are you sure you want to remove enrollment for ${studentName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Enrollments refreshed successfully');
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading enrollments: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 text-white">
            <i className="bi bi-journal-check me-2 text-primary"></i>
            Enrollment Management
          </h2>
          <p className="text-secondary mb-0 mt-1">Manage student course enrollments</p>
        </div>
        {user?.role === 'Admin' && (
          <Link to="/enrollments/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>New Enrollment
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-secondary">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0 text-white"
                  placeholder="Search by student name, number, course or section..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearch('')}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-auto ms-auto">
              <button className="btn btn-outline-primary" onClick={handleRefresh}>
                <i className="bi bi-arrow-repeat me-1"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Student Number</th>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-secondary">
                      {search ? 'No enrollments match your search' : 'No enrollments found'}
                    </td>
                  </tr>
                ) : (
                  filteredEnrollments.map((enrollment) => (
                    <tr key={enrollment.EnrollmentID}>
                      <td className="text-white">{enrollment.EnrollmentID}</td>
                      <td className="text-white fw-semibold">
                        {`${enrollment.FirstName || ''} ${enrollment.LastName || ''}`.trim() || '-'}
                      </td>
                      <td className="text-white">{enrollment.StudentNumber || '-'}</td>
                      <td className="text-white">{enrollment.CourseTitle || '-'}</td>
                      <td className="text-white">{enrollment.SectionName || '-'}</td>
                      <td className="text-white">
                        {enrollment.EnrollmentDate ? new Date(enrollment.EnrollmentDate).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <span className={`badge ${enrollment.Status === 'Enrolled' ? 'bg-success' : 'bg-danger'}`}>
                          {enrollment.Status || 'Enrolled'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/enrollments/view/${enrollment.EnrollmentID}`}
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {user?.role === 'Admin' && (
                            <>
                              <Link
                                to={`/enrollments/edit/${enrollment.EnrollmentID}`}
                                className="btn btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(enrollment.EnrollmentID, `${enrollment.FirstName} ${enrollment.LastName}`)}
                                disabled={deleteMutation.isLoading}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="text-center text-secondary small mt-3">
        Showing {filteredEnrollments.length} of {enrollments.length} enrollments
      </div>
    </div>
  );
};

export default EnrollmentList;