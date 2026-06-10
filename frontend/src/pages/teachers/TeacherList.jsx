// pages/teachers/TeacherList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeachers, deleteTeacher } from '../../services/teacherService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const TeacherList = () => {
  const { user, logout } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['teachers', search],
    queryFn: () => getTeachers({ search }),
    retry: false,
  });

  console.log('Full response from useQuery:', data);
  
  // IMPORTANT: Axios response is wrapped in .data
  // Your backend returns: { success: true, data: [...] }
  // So the teachers array is at: data?.data?.data
  const responseData = data?.data || {};
  const teachers = responseData?.data || [];
  
  // Alternative extraction if the above doesn't work:
  // const teachers = data?.data?.data || data?.data || [];
  
  console.log('Teachers array:', teachers);
  console.log('Is teachers an array?', Array.isArray(teachers));
  console.log('Number of teachers:', teachers.length);

  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: async () => {
      success('Teacher deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['teachers'] });
      refetch();
    },
    onError: (err) => {
      if (err?.response?.status === 401) {
        notifyError('Session expired. Please login again.');
        logout();
      } else {
        notifyError(err?.response?.data?.message || 'Failed to delete teacher');
      }
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete teacher: ${name}?`)) {
      deleteMutation.mutate(id);
    }
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
        Error loading teachers: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  // Ensure teachers is always an array
  const teachersList = Array.isArray(teachers) ? teachers : [];

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 text-dark">
            <i className="bi bi-person-badge me-2 text-primary"></i>
            Teacher Management
          </h2>
          <p className="text-secondary mb-0 mt-1">Manage all teacher records</p>
        </div>
        {user?.role === 'Admin' && (
          <Link to="/teachers/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Teacher
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
                  className="form-control border-start-0 ps-0 text-dark"
                  placeholder="Search by name or department..."
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

      {/* Teachers Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Full Name</th>
                  <th>Department</th>
                  <th>Qualification</th>
                  <th>Specialization</th>
                  <th>Hire Date</th>
                  <th>Salary</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachersList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-secondary">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No teachers found
                    </td>
                  </tr>
                ) : (
                  teachersList.map((teacher) => (
                    <tr key={teacher.TeacherID}>
                      <td className="text-white">{teacher.TeacherID}</td>
                      <td className="text-white fw-semibold">
                        {`${teacher.FirstName || ''} ${teacher.LastName || ''}`.trim() || '-'}
                      </td>
                      <td className="text-white">{teacher.DeptName || '-'}</td>
                      <td className="text-white">{teacher.Qualification || '-'}</td>
                      <td className="text-white">{teacher.Specialization || '-'}</td>
                      <td className="text-white">
                        {teacher.HireDate ? new Date(teacher.HireDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="text-white">
                        {teacher.Salary ? `ETB ${Number(teacher.Salary).toLocaleString()}` : '-'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/teachers/view/${teacher.TeacherID}`}
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link
                            to={`/teachers/edit/${teacher.TeacherID}`}
                            className="btn btn-outline-primary"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          {user?.role === 'Admin' && (
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(teacher.TeacherID, `${teacher.FirstName} ${teacher.LastName}`)}
                              disabled={deleteMutation.isLoading}
                              title="Delete"
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
      <div className="text-center text-secondary small mt-3">
        Showing {teachersList.length} teacher{teachersList.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default TeacherList;