// src/pages/teaches/TeachesList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeaches, deleteTeach } from '../../services/teachesService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const TeachesList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  // Allow both Admin and Teacher to view
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['teaches'],
    queryFn: () => getTeaches(),
    enabled: user?.role === 'Admin' || user?.role === 'Teacher',
  });

  // Extract data - handle different response structures
  let assignments = [];
  if (data?.data && Array.isArray(data.data)) {
    assignments = data.data;
  } else if (data?.data?.data && Array.isArray(data.data.data)) {
    assignments = data.data.data;
  } else if (Array.isArray(data)) {
    assignments = data;
  }

  console.log('Assignments:', assignments);

  const deleteMutation = useMutation({
    mutationFn: deleteTeach,
    onSuccess: async () => {
      success('Assignment removed successfully');
      await queryClient.invalidateQueries({ queryKey: ['teaches'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to remove assignment');
    },
  });

  const handleDelete = (id, teacherName, sectionName) => {
    if (window.confirm(`Are you sure you want to remove ${teacherName} from ${sectionName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment =>
    (assignment.FirstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (assignment.LastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (assignment.SectionName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (assignment.CourseTitle?.toLowerCase() || '').includes(search.toLowerCase())
  );

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
        Error loading assignments: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-person-badge me-2 text-primary"></i>
            Teacher Assignments
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>
            {user?.role === 'Admin' 
              ? 'Manage teacher to course/section assignments'
              : 'View teacher course/section assignments'}
          </p>
        </div>
        {/* Only Admin can add new assignments */}
        {user?.role === 'Admin' && (
          <Link to="/teaches/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Assign Teacher
          </Link>
        )}
      </div>

      {/* Search Bar - Available for both Admin and Teacher */}
      <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0" style={{ color: '#6c757d' }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  style={{ color: '#white', backgroundColor: '#ffffff' }}
                  placeholder="Search by teacher, section or course..."
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
              <button className="btn btn-outline-primary" onClick={() => refetch()}>
                <i className="bi bi-arrow-repeat me-1"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Teacher</th>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Primary</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5" style={{ color: '#6c757d' }}>
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      {search ? 'No assignments match your search' : 'No teacher assignments found'}
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((assignment) => (
                    <tr key={assignment.TeachesID}>
                      <td style={{ color: '#white' }}>{assignment.TeachesID}</td>
                      <td className="fw-semibold" style={{ color: '#white' }}>
                        {assignment.FirstName} {assignment.LastName}
                      </td>
                      <td style={{ color: '#white' }}>{assignment.CourseTitle}</td>
                      <td style={{ color: '#white' }}>{assignment.SectionName}</td>
                      <td>
                        {assignment.IsPrimaryTeacher === 1 ? (
                          <span className="badge bg-success">Primary</span>
                        ) : (
                          <span className="badge bg-secondary">Secondary</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {/* View button - Everyone can view */}
                         <Link
                          to={`/teaches/view/${assignment.TeachesID}`}
                          state={{ assignment: assignment }}  // Make sure this is correct
                          className="btn btn-outline-info"
                          title="View Details"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                          
                          {/* Edit button - Admin only */}
                          {user?.role === 'Admin' && (
                            <Link
                              to={`/teaches/edit/${assignment.TeachesID}`}
                              className="btn btn-outline-primary"
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                          )}
                          
                          {/* Delete button - Admin only */}
                          {user?.role === 'Admin' && (
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(
                                assignment.TeachesID,
                                `${assignment.FirstName} ${assignment.LastName}`,
                                assignment.SectionName
                              )}
                              disabled={deleteMutation.isLoading}
                              title="Remove Assignment"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
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

      {/* Info footer */}
      <div className="text-center small mt-3" style={{ color: '#6c757d' }}>
        Showing {filteredAssignments.length} of {assignments.length} assignments
      </div>
    </div>
  );
};

export default TeachesList;