// pages/departments/DepartmentList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDepartments, deleteDepartment } from '../../services/departmentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const DepartmentList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['departments'],
    queryFn: () => getDepartments(),
  });

  console.log('Departments API Response:', data);

  // Extract departments from response
  let departments = [];
  if (data?.data && Array.isArray(data?.data)) {
    departments = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    departments = data.data.data;
  } else if (Array.isArray(data)) {
    departments = data;
  }

  console.log('Extracted departments:', departments);

  // Filter departments based on search
  useEffect(() => {
    if (departments.length > 0) {
      if (search.trim() === '') {
        setFilteredDepartments(departments);
      } else {
        const filtered = departments.filter(dept =>
          (dept.DeptName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (dept.HeadOfDept?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredDepartments(filtered);
      }
    } else {
      setFilteredDepartments([]);
    }
  }, [search, departments]);

  const deleteMutation = useMutation({
    mutationFn: deleteDepartment,
    onSuccess: async () => {
      success('Department deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['departments'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete department');
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete department: ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Departments refreshed successfully');
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
        Error loading departments: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 text-white">
            <i className="bi bi-building me-2 text-primary"></i>
            Department Management
          </h2>
          <p className="text-secondary mb-0 mt-1">Manage all academic departments</p>
        </div>
        {user?.role === 'Admin' && (
          <Link to="/departments/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Department
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
                  placeholder="Search by department name or head..."
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

      {/* Departments Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Department Name</th>
                  <th>Head of Department</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-secondary">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      {search ? 'No departments match your search' : 'No departments found'}
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((dept) => (
                    <tr key={dept.DeptID}>
                      <td className="text-white">{dept.DeptID}</td>
                      <td className="text-white fw-semibold">{dept.DeptName}</td>
                      <td className="text-white">{dept.HeadOfDept || '-'}</td>
                      <td className="text-white">{dept.Phone || '-'}</td>
                      <td className="text-white">{dept.Location || '-'}</td>
                      <td>
                        <span className={`badge ${dept.IsActive === 1 || dept.IsActive === true ? 'bg-success' : 'bg-secondary'}`}>
                          {dept.IsActive === 1 || dept.IsActive === true ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/departments/view/${dept.DeptID}`}
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {user?.role === 'Admin' && (
                            <>
                              <Link
                                to={`/departments/edit/${dept.DeptID}`}
                                className="btn btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(dept.DeptID, dept.DeptName)}
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

      {/* Info footer */}
      <div className="text-center text-secondary small mt-3">
        Showing {filteredDepartments.length} of {departments.length} departments
      </div>
    </div>
  );
};

export default DepartmentList;