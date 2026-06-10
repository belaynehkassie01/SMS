// pages/exams/ExamList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExams, deleteExam } from '../../services/examService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const ExamList = () => {
  const { user, isAdmin, isTeacher } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredExams, setFilteredExams] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['exams'],
    queryFn: () => getExams(),
  });

  // Debug logs
  console.log('=== EXAM LIST DEBUG ===');
  console.log('User role:', user?.role);
  console.log('isAdmin:', isAdmin);
  console.log('isTeacher:', isTeacher);

  // Extract exams from response
  let exams = [];
  if (data?.data && Array.isArray(data?.data)) {
    exams = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    exams = data.data.data;
  } else if (Array.isArray(data)) {
    exams = data;
  }

  // Filter exams based on search
  useEffect(() => {
    if (exams.length > 0) {
      if (search.trim() === '') {
        setFilteredExams(exams);
      } else {
        const filtered = exams.filter(exam =>
          (exam.ExamName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (exam.CourseTitle?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (exam.SectionName?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredExams(filtered);
      }
    } else {
      setFilteredExams([]);
    }
  }, [search, exams]);

  const deleteMutation = useMutation({
    mutationFn: deleteExam,
    onSuccess: async () => {
      success('Exam deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['exams'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete exam');
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete exam: ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Exams refreshed successfully');
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
        Error loading exams: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  const canCreateEdit = isAdmin || isTeacher;
  const canDelete = isAdmin;

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-file-text me-2 text-primary"></i>
            Exam Management
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Manage all examinations</p>
        </div>
        {canCreateEdit && (
          <Link to="/exams/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Exam
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
                  style={{ color: '#000', backgroundColor: '#ffffff' }}
                  placeholder="Search by exam name, course or section..."
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

      {/* Exams Table */}
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px', color: '#0617fd' }}>ID</th>
                  <th>Exam Name</th>
                  <th>Course</th>
                  <th>Section</th>
                  <th>Exam Date</th>
                  <th>Max Marks</th>
                  <th>Weightage</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5" style={{ color: '#6c757d' }}>
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      {search ? 'No exams match your search' : 'No exams found'}
                    </td>
                  </tr>
                ) : (
                  filteredExams.map((exam) => (
                    <tr key={exam.ExamID}>
                      <td style={{ color: '#white' }}>{exam.ExamID}</td>
                      <td className="fw-semibold" style={{ color: '#white' }}>{exam.ExamName}</td>
                      <td style={{ color: '#white' }}>{exam.CourseTitle || '-'}</td>
                      <td style={{ color: '#white' }}>{exam.SectionName || '-'}</td>
                      <td style={{ color: '#white' }}>
                        {exam.ExamDate ? new Date(exam.ExamDate).toLocaleDateString() : '-'}
                      </td>
                      <td style={{ color: '#white' }}>{exam.MaxMarks || '-'}</td>
                      <td style={{ color: '#white' }}>{exam.Weightage ? `${exam.Weightage}%` : '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/exams/view/${exam.ExamID}`}
                            className="btn btn-sm btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i> View
                          </Link>
                          {canCreateEdit && (
                            <Link
                              to={`/exams/edit/${exam.ExamID}`}
                              className="btn btn-sm btn-outline-primary"
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i> Edit
                            </Link>
                          )}
                          {canDelete && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(exam.ExamID, exam.ExamName)}
                              disabled={deleteMutation.isLoading}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i> Delete
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
        Showing {filteredExams.length} of {exams.length} exams
      </div>
    </div>
  );
};

export default ExamList;