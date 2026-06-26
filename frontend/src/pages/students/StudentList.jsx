// pages/students/StudentList.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudents, deleteStudent } from '../../services/studentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const StudentList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const limit = 10;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students', page, search],
    queryFn: () => getStudents({ page, limit, search }),
    keepPreviousData: true,
  });

  // CORRECTED: Your backend returns { success: true, data: [...] }
  const responseData = data?.data || {};
  const students = responseData?.data || [];
  const total = students.length;

  console.log('Students data:', students); // Debug - check what fields are available

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: async () => {
      success('Student deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['students'] });
      refetch();
    },
    onError: (err) => {
      if (err?.response?.status === 401) {
        notifyError('Session expired. Please login again.');
      } else {
        notifyError(err?.response?.data?.message || 'Failed to delete student');
      }
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete student: ${name}?`)) {
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
        Error loading students: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 text-dark">
            <i className="bi bi-people-fill me-2 text-primary"></i>
            Student Management
          </h2>
          <p className="text-secondary mb-0 mt-1">Manage all student records</p>
        </div>
        {user?.role === 'Admin' && (
          <Link to="/students/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Student
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
                  placeholder="Search by name, email, or student number..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setPage(1);
                    }}
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

      {/* Students Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Student Number</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th style={{ width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-secondary">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                    // Debug: log each student to see available fields
                    console.log('Student object:', student);
                    
                    // 🔥 FIXED: Get the correct ID for deletion
                    // Use PersonID first (backend expects this for deletion)
                    const studentId = student.PersonID || student.id || student.StudentID;
                    
                    // Get full name
                    const fullName = student.FullName || 
                                    `${student.FirstName || ''} ${student.LastName || ''}`.trim() || 
                                    'Unknown';
                    
                    return (
                      <tr key={student.StudentID || student.id || student.PersonID}>
                        <td className="text-white">{student.StudentID || student.id || '-'}</td>
                        <td className="text-white fw-semibold">
                          {student.StudentNumber || student.studentNumber || '-'}
                        </td>
                        <td className="text-white">{fullName}</td>
                        <td className="text-white">{student.Email || student.email || '-'}</td>
                        <td className="text-white">{student.Phone || student.phone || '-'}</td>
                        <td className="text-white">
                          {student.DeptName || 
                           student.DepartmentName || 
                           student.departmentName || 
                           '-'}
                        </td>
                        <td>
                          <span className={`badge ${(student.Status || student.status) === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                            {student.Status || student.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            {/* View Details Button */}
                            <Link
                              to={`/students/view/${studentId}`}
                              className="btn btn-outline-info"
                              title="View Details"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                            
                            {/* Generate Report Card Button */}
                            <Link
                              to={`/students/report/${studentId}`}
                              className="btn btn-outline-success"
                              title="Generate Report Card"
                            >
                              <i className="bi bi-file-text"></i>
                            </Link>
                            
                            {/* Edit Button */}
                            <Link
                              to={`/students/edit/${studentId}`}
                              className="btn btn-outline-primary"
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                            
                            {/* 🔥 FIXED: Delete Button - Admin only */}
                            {user?.role === 'Admin' && (
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(studentId, fullName)}
                                disabled={deleteMutation.isLoading}
                                title="Delete"
                              >
                                {deleteMutation.isLoading ? (
                                  <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                  <i className="bi bi-trash"></i>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="text-center text-secondary small mt-3">
        Showing {students.length} student{students.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default StudentList;