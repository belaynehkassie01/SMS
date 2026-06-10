// pages/academicYears/AcademicYearList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAcademicYears, deleteAcademicYear } from '../../services/academicYearService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const AcademicYearList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredYears, setFilteredYears] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['academicYears'],
    queryFn: () => getAcademicYears(),
  });

  // Extract academic years from response
  let academicYears = [];
  if (data?.data && Array.isArray(data?.data)) {
    academicYears = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    academicYears = data.data.data;
  } else if (Array.isArray(data)) {
    academicYears = data;
  }

  // Filter academic years based on search
  useEffect(() => {
    if (academicYears.length > 0) {
      if (search.trim() === '') {
        setFilteredYears(academicYears);
      } else {
        const filtered = academicYears.filter(year =>
          (year.Year?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (year.Semester?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredYears(filtered);
      }
    } else {
      setFilteredYears([]);
    }
  }, [search, academicYears]);

  const deleteMutation = useMutation({
    mutationFn: deleteAcademicYear,
    onSuccess: async () => {
      success('Academic year deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete academic year');
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete academic year: ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Academic years refreshed successfully');
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
        Error loading academic years: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 text-white">
            <i className="bi bi-calendar-event me-2 text-primary"></i>
            Academic Year Management
          </h2>
          <p className="text-secondary mb-0 mt-1">Manage academic years and semesters</p>
        </div>
        {user?.role === 'Admin' && (
          <Link to="/academic-years/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Academic Year
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
                  placeholder="Search by year or semester..."
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

      {/* Academic Years Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Academic Year</th>
                  <th>Semester</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredYears.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-secondary">
                      {search ? 'No academic years match your search' : 'No academic years found'}
                    </td>
                  </tr>
                ) : (
                  filteredYears.map((year) => (
                    <tr key={year.AcademicYearID}>
                      <td className="text-white">{year.AcademicYearID}</td>
                      <td className="text-white fw-semibold">{year.Year}</td>
                      <td className="text-white">{year.Semester}</td>
                      <td className="text-white">
                        {year.StartDate ? new Date(year.StartDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="text-white">
                        {year.EndDate ? new Date(year.EndDate).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <span className={`badge ${year.IsActive === 1 || year.IsActive === true ? 'bg-success' : 'bg-secondary'}`}>
                          {year.IsActive === 1 || year.IsActive === true ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/academic-years/view/${year.AcademicYearID}`}
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {user?.role === 'Admin' && (
                            <>
                              <Link
                                to={`/academic-years/edit/${year.AcademicYearID}`}
                                className="btn btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(year.AcademicYearID, `${year.Year} - ${year.Semester}`)}
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
        Showing {filteredYears.length} of {academicYears.length} academic years
      </div>
    </div>
  );
};

export default AcademicYearList;