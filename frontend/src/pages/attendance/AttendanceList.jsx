// pages/attendance/AttendanceList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttendance, deleteAttendance } from '../../services/attendanceService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const AttendanceList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => getAttendance(),
  });

  console.log('Attendance API Response:', data);

  // Extract attendance from response
  let attendance = [];
  if (data?.data && Array.isArray(data?.data)) {
    attendance = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    attendance = data.data.data;
  } else if (Array.isArray(data)) {
    attendance = data;
  }

  console.log('Extracted attendance:', attendance);

  // Filter attendance based on search
  useEffect(() => {
    if (attendance.length > 0) {
      if (search.trim() === '') {
        setFilteredAttendance(attendance);
      } else {
        const filtered = attendance.filter(record =>
          (record.FirstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (record.LastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (record.StudentNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (record.Status?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredAttendance(filtered);
      }
    } else {
      setFilteredAttendance([]);
    }
  }, [search, attendance]);

  const deleteMutation = useMutation({
    mutationFn: deleteAttendance,
    onSuccess: async () => {
      success('Attendance record deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['attendance'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete attendance record');
    },
  });

  const handleDelete = (id, studentName, date) => {
    if (window.confirm(`Are you sure you want to delete attendance for ${studentName} on ${date}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Attendance records refreshed successfully');
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'Present') return 'bg-success';
    if (status === 'Absent') return 'bg-danger';
    if (status === 'Late') return 'bg-warning text-dark';
    return 'bg-secondary';
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
        Error loading attendance: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-calendar-check me-2 text-primary"></i>
            Attendance Management
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Track student attendance records</p>
        </div>
        {/* Only Admin and Teacher can mark attendance - Student cannot */}
        {(user?.role === 'Admin' || user?.role === 'Teacher') && (
          <Link to="/attendance/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Mark Attendance
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
                  placeholder="Search by student name, number or status..."
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

      {/* Attendance Table */}
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Student Name</th>
                  <th>Student Number</th>
                  <th>Section</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Remarks</th>
                  <th style={{ width: '150px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5" style={{ color: '#6c757d' }}>
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      {search ? 'No attendance records match your search' : 'No attendance records found'}
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((record) => (
                    <tr key={record.AttendanceID}>
                      <td style={{ color: 'white' }}>{record.AttendanceID}</td>
                      <td className="fw-semibold" style={{ color: 'white' }}>
                        {`${record.FirstName || ''} ${record.LastName || ''}`.trim() || '-'}
                      </td>
                      <td style={{ color: 'white' }}>{record.StudentNumber || '-'}</td>
                      <td style={{ color: 'white' }}>{record.SectionName || '-'}</td>
                      <td style={{ color: 'white' }}>
                        {record.Date ? new Date(record.Date).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(record.Status)}`}>
                          {record.Status || '-'}
                        </span>
                      </td>
                      <td style={{ color: 'white' }}>{record.CheckInTime || '-'}</td>
                      <td style={{ color: 'white' }}>{record.CheckOutTime || '-'}</td>
                      <td style={{ color: 'white' }}>{record.Remarks || '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          {/* View button - Everyone can view */}
                          <Link
                            to={`/attendance/view/${record.AttendanceID}`}
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {/* Edit button - Only Admin and Teacher */}
                          {(user?.role === 'Admin' || user?.role === 'Teacher') && (
                            <Link
                              to={`/attendance/edit/${record.AttendanceID}`}
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
                              onClick={() => handleDelete(record.AttendanceID, `${record.FirstName} ${record.LastName}`, new Date(record.Date).toLocaleDateString())}
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
      <div className="text-center small mt-3" style={{ color: '#6c757d' }}>
        Showing {filteredAttendance.length} of {attendance.length} attendance records
      </div>
    </div>
  );
};

export default AttendanceList;