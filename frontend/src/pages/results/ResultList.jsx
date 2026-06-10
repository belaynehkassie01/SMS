// pages/results/ResultList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getResults, deleteResult } from '../../services/resultService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const ResultList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['results'],
    queryFn: () => getResults(),
  });

  // Extract results from response
  let results = [];
  if (data?.data && Array.isArray(data?.data)) {
    results = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    results = data.data.data;
  } else if (Array.isArray(data)) {
    results = data;
  }

  // Filter results based on search
  useEffect(() => {
    if (results.length > 0) {
      if (search.trim() === '') {
        setFilteredResults(results);
      } else {
        const filtered = results.filter(result =>
          (result.FirstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (result.LastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (result.StudentNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (result.ExamName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (result.Grade?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredResults(filtered);
      }
    } else {
      setFilteredResults([]);
    }
  }, [search, results]);

  const deleteMutation = useMutation({
    mutationFn: deleteResult,
    onSuccess: async () => {
      success('Result deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['results'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete result');
    },
  });

  const handleDelete = (id, studentName, examName) => {
    if (window.confirm(`Are you sure you want to delete result for ${studentName} - ${examName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Results refreshed successfully');
  };

  // Helper to get grade badge color
  const getGradeBadgeColor = (grade) => {
    if (!grade) return 'bg-secondary';
    const upperGrade = grade.toUpperCase();
    if (upperGrade.startsWith('A')) return 'bg-success';
    if (upperGrade.startsWith('B')) return 'bg-info';
    if (upperGrade.startsWith('C')) return 'bg-warning text-dark';
    if (upperGrade.startsWith('D')) return 'bg-warning text-dark';
    return 'bg-danger';
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
        Error loading results: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-trophy me-2 text-primary"></i>
            Result Management
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Manage student exam results and grades</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Teacher') && (
          <Link to="/results/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Result
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0" style={{ color: '#6c757d' }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  style={{ color: 'white', backgroundColor: '#ffffff' }}
                  placeholder="Search by student name, number, exam or grade..."
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

      {/* Results Table */}
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Student Name</th>
                  <th>Student Number</th>
                  <th>Exam</th>
                  <th>Obtained Marks</th>
                  <th>Grade</th>
                  <th>Remarks</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5" style={{ color: '#6c757d' }}>
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      {search ? 'No results match your search' : 'No results found'}
                    </td>
                  </tr>
                ) : (
                  filteredResults.map((result) => (
                    <tr key={result.ResultID}>
                      <td style={{ color: 'white' }}>{result.ResultID}</td>
                      <td className="fw-semibold" style={{ color: 'white' }}>
                        {`${result.FirstName || ''} ${result.LastName || ''}`.trim() || '-'}
                      </td>
                      <td style={{ color: 'white' }}>{result.StudentNumber || '-'}</td>
                      <td style={{ color: 'white' }}>{result.ExamName || '-'}</td>
                      <td style={{ color: 'white' }}>{result.ObtainedMarks || '-'}</td>
                      <td>
                        <span className={`badge ${getGradeBadgeColor(result.Grade)}`}>
                          {result.Grade || '-'}
                        </span>
                      </td>
                      <td style={{ color: 'white' }}>{result.Remarks || '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/results/view/${result.ResultID}`}
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {(user?.role === 'Admin' || user?.role === 'Teacher') && (
                            <>
                              <Link
                                to={`/results/edit/${result.ResultID}`}
                                className="btn btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              {user?.role === 'Admin' && (
                                <button
                                  className="btn btn-outline-danger"
                                  onClick={() => handleDelete(result.ResultID, `${result.FirstName} ${result.LastName}`, result.ExamName)}
                                  disabled={deleteMutation.isLoading}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
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
      <div className="text-center small mt-3" style={{ color: '#6c757d' }}>
        Showing {filteredResults.length} of {results.length} results
      </div>
    </div>
  );
};

export default ResultList;