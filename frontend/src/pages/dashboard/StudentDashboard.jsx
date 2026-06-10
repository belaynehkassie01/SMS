// pages/dashboard/StudentDashboard.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { getEnrollments } from '../../services/enrollmentService';
import { getResults } from '../../services/resultService';
import { getAttendance } from '../../services/attendanceService';
import { useNotification } from '../../context/NotificationContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { error: notifyError } = useNotification();
  const today = new Date().toLocaleDateString();

  // Log user info for debugging
  useEffect(() => {
    console.log('=== Student Dashboard Debug ===');
    console.log('Current user:', user);
    console.log('User ID:', user?.id);
    console.log('User role:', user?.role);
  }, [user]);

  // Query configuration
  const queryConfig = {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  };

  // Fetch student's enrollments
  const { 
    data: enrollmentsData, 
    isLoading: loadingEnrollments,
    error: enrollmentsError,
    isError: isEnrollmentsError
  } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      console.log('Fetching enrollments...');
      const response = await getEnrollments();
      console.log('Enrollments API Response:', response);
      return response;
    },
    enabled: !!user?.id,
    ...queryConfig,
  });

  // Fetch student's results
  const { 
    data: resultsData, 
    isLoading: loadingResults,
    error: resultsError,
    isError: isResultsError
  } = useQuery({
    queryKey: ['results', user?.id],
    queryFn: async () => {
      console.log('Fetching results...');
      const response = await getResults();
      console.log('Results API Response:', response);
      return response;
    },
    enabled: !!user?.id,
    ...queryConfig,
  });

  // Fetch student's attendance
  const { 
    data: attendanceData, 
    isLoading: loadingAttendance,
    error: attendanceError,
    isError: isAttendanceError
  } = useQuery({
    queryKey: ['attendance', user?.id],
    queryFn: async () => {
      console.log('Fetching attendance...');
      const response = await getAttendance();
      console.log('Attendance API Response:', response);
      return response;
    },
    enabled: !!user?.id,
    ...queryConfig,
  });

  // Log errors
  useEffect(() => {
    if (isEnrollmentsError) {
      console.error('Enrollments error:', enrollmentsError);
      console.error('Enrollments error response:', enrollmentsError?.response);
    }
    if (isResultsError) {
      console.error('Results error:', resultsError);
      console.error('Results error response:', resultsError?.response);
    }
    if (isAttendanceError) {
      console.error('Attendance error:', attendanceError);
      console.error('Attendance error response:', attendanceError?.response);
    }
  }, [isEnrollmentsError, isResultsError, isAttendanceError, enrollmentsError, resultsError, attendanceError]);

  // Extract enrollments data with debug
  let enrollments = [];
  if (enrollmentsData?.data && Array.isArray(enrollmentsData.data)) {
    enrollments = enrollmentsData.data;
  } else if (enrollmentsData?.data?.data && Array.isArray(enrollmentsData.data.data)) {
    enrollments = enrollmentsData.data.data;
  } else if (Array.isArray(enrollmentsData)) {
    enrollments = enrollmentsData;
  }
  console.log('Extracted enrollments:', enrollments);
  console.log('Enrollments count:', enrollments.length);

  // Extract results data
  let results = [];
  if (resultsData?.data && Array.isArray(resultsData.data)) {
    results = resultsData.data;
  } else if (resultsData?.data?.data && Array.isArray(resultsData.data.data)) {
    results = resultsData.data.data;
  } else if (Array.isArray(resultsData)) {
    results = resultsData;
  }
  console.log('Extracted results:', results);
  console.log('Results count:', results.length);

  // Extract attendance data
  let attendance = [];
  if (attendanceData?.data && Array.isArray(attendanceData.data)) {
    attendance = attendanceData.data;
  } else if (attendanceData?.data?.data && Array.isArray(attendanceData.data.data)) {
    attendance = attendanceData.data.data;
  } else if (Array.isArray(attendanceData)) {
    attendance = attendanceData;
  }
  console.log('Extracted attendance:', attendance);
  console.log('Attendance count:', attendance.length);

  // Calculate stats
  const stats = {
    totalCourses: enrollments.length || 0,
    completedCourses: results.filter(r => r.Grade && r.Grade !== 'F').length || 0,
    attendanceRate: calculateAttendanceRate(attendance),
  };

  function calculateAttendanceRate(attendanceRecords) {
    if (!attendanceRecords || attendanceRecords.length === 0) return 0;
    const presentCount = attendanceRecords.filter(a => a.Status === 'Present').length;
    return Math.round((presentCount / attendanceRecords.length) * 100);
  }

  const getGradeBadgeColor = (grade) => {
    if (!grade) return 'bg-secondary';
    const upperGrade = grade.toUpperCase();
    if (upperGrade.startsWith('A')) return 'bg-success';
    if (upperGrade.startsWith('B')) return 'bg-info';
    if (upperGrade.startsWith('C')) return 'bg-warning text-dark';
    if (upperGrade.startsWith('D')) return 'bg-warning text-dark';
    return 'bg-danger';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-success';
      case 'Absent':
        return 'bg-danger';
      case 'Late':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  // Show loading state
  if (loadingEnrollments || loadingResults || loadingAttendance) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading your dashboard...</p>
      </div>
    );
  }

  // Show error state with details
  if (enrollmentsError || resultsError || attendanceError) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        <strong>Error loading your data!</strong>
        <div className="mt-2">
          <p className="mb-1">Please check:</p>
          <ul className="mb-0">
            <li>If you are logged in correctly</li>
            <li>If you have enrollments in the database</li>
            <li>If the backend API is running</li>
          </ul>
        </div>
        {(enrollmentsError || resultsError || attendanceError)?.response?.data?.message && (
          <div className="mt-2 small text-danger">
            <strong>Error details:</strong> {(enrollmentsError || resultsError || attendanceError)?.response?.data?.message}
          </div>
        )}
        <div className="mt-2 small">
          <button 
            className="btn btn-sm btn-primary mt-2"
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-repeat me-1"></i>
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show message if no data
  if (enrollments.length === 0 && results.length === 0 && attendance.length === 0) {
    return (
      <div className="container-fluid px-0">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
              <i className="bi bi-mortarboard me-2 text-primary"></i>
              Student Dashboard
            </h2>
            <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>
              Welcome back, {user?.fullName || user?.username || 'Student'}!
            </p>
          </div>
          <div className="bg-white rounded p-2 px-3 shadow-sm text-center">
            <i className="bi bi-calendar3 text-primary me-1"></i>
            <span style={{ color: '#212529' }}>{today}</span>
          </div>
        </div>

        {/* Stats Cards - Show 0 */}
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <div className="card-body text-center">
                <i className="bi bi-book fs-1 text-primary"></i>
                <h5 className="mt-2" style={{ color: '#212529' }}>Enrolled Courses</h5>
                <h2 className="text-primary">0</h2>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <div className="card-body text-center">
                <i className="bi bi-trophy fs-1 text-warning"></i>
                <h5 className="mt-2" style={{ color: '#212529' }}>Completed Courses</h5>
                <h2 className="text-warning">0</h2>
              </div>
            </div>
          </div>
          <div className="col-sm-6 col-lg-4">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
              <div className="card-body text-center">
                <i className="bi bi-calendar-check fs-1 text-info"></i>
                <h5 className="mt-2" style={{ color: '#212529' }}>Attendance Rate</h5>
                <h2 className="text-info">0%</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Message about no data */}
        <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
          <div className="card-body text-center py-5">
            <i className="bi bi-database fs-1 text-warning mb-3 d-block"></i>
            <h4 style={{ color: '#1a1a2e' }}>No Data Available</h4>
            <p style={{ color: '#6c757d' }} className="mb-3">
              You don't have any enrollments, results, or attendance records yet.
            </p>
            <p style={{ color: '#6c757d' }} className="small">
              If you believe this is an error, please contact your administrator.<br/>
              <strong>Debug Info:</strong> User ID: {user?.id || 'Not found'}, Role: {user?.role || 'Not found'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Rest of your dashboard with data
  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-mortarboard me-2 text-primary"></i>
            Student Dashboard
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>
            Welcome back, {user?.fullName || user?.username || 'Student'}!
          </p>
        </div>
        <div className="bg-white rounded p-2 px-3 shadow-sm text-center">
          <i className="bi bi-calendar3 text-primary me-1"></i>
          <span style={{ color: '#212529' }}>{today}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center">
              <i className="bi bi-book fs-1 text-primary"></i>
              <h5 className="mt-2" style={{ color: '#212529' }}>Enrolled Courses</h5>
              <h2 className="text-primary">{stats.totalCourses}</h2>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center">
              <i className="bi bi-trophy fs-1 text-warning"></i>
              <h5 className="mt-2" style={{ color: '#212529' }}>Completed Courses</h5>
              <h2 className="text-warning">{stats.completedCourses}</h2>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center">
              <i className="bi bi-calendar-check fs-1 text-info"></i>
              <h5 className="mt-2" style={{ color: '#212529' }}>Attendance Rate</h5>
              <h2 className="text-info">{stats.attendanceRate}%</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <Link to="/courses" className="text-decoration-none">
            <div className="card border-0 shadow-sm bg-primary text-white" style={{ borderRadius: '12px' }}>
              <div className="card-body text-center py-3">
                <i className="bi bi-journal-bookmark-fill fs-2"></i>
                <p className="mb-0 mt-1 fw-semibold">My Courses</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/results" className="text-decoration-none">
            <div className="card border-0 shadow-sm bg-success text-white" style={{ borderRadius: '12px' }}>
              <div className="card-body text-center py-3">
                <i className="bi bi-trophy fs-2"></i>
                <p className="mb-0 mt-1 fw-semibold">My Results</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/attendance" className="text-decoration-none">
            <div className="card border-0 shadow-sm bg-warning text-white" style={{ borderRadius: '12px' }}>
              <div className="card-body text-center py-3">
                <i className="bi bi-calendar-check fs-2"></i>
                <p className="mb-0 mt-1 fw-semibold">My Attendance</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-header bg-white border-bottom">
          <h5 className="mb-0" style={{ color: '#212529' }}>
            <i className="bi bi-journal-bookmark-fill me-2 text-primary"></i>
            My Enrolled Courses
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {enrollments.map((enrollment) => (
              <div key={enrollment.EnrollmentID} className="col-md-6 col-lg-4">
                <div className="card h-100 border">
                  <div className="card-body">
                    <h6 className="card-title fw-semibold" style={{ color: '#212529' }}>
                      {enrollment.CourseTitle || enrollment.Title || 'Course'}
                    </h6>
                    <p className="card-text small mb-1" style={{ color: '#6c757d' }}>
                      <i className="bi bi-grid me-1"></i> Section: {enrollment.SectionName || 'N/A'}
                    </p>
                    <p className="card-text small" style={{ color: '#6c757d' }}>
                      <i className="bi bi-person me-1"></i> Instructor: {enrollment.InstructorName || enrollment.FirstName ? `${enrollment.FirstName || ''} ${enrollment.LastName || ''}`.trim() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results and Attendance Row */}
      <div className="row g-3">
        {/* Recent Results */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0" style={{ color: '#212529' }}>
                <i className="bi bi-trophy me-2 text-warning"></i>
                Recent Results
              </h5>
              <Link to="/results" className="btn btn-sm btn-primary">
                <i className="bi bi-eye me-1"></i> View All
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                {results.slice(0, 5).map((result) => (
                  <div key={result.ResultID} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1 fw-semibold" style={{ color: '#212529' }}>
                        {result.ExamName || 'Exam'}
                      </h6>
                      <small style={{ color: '#6c757d' }}>
                        {result.CourseTitle || 'Course'}
                      </small>
                    </div>
                    <div className="text-end">
                      <span className={`badge ${getGradeBadgeColor(result.Grade)} fs-6`}>
                        {result.Grade || 'N/A'}
                      </span>
                      <div className="mt-1">
                        <small style={{ color: '#6c757d' }}>
                          Marks: {result.ObtainedMarks || 0} / {result.MaxMarks || 100}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
              <h5 className="mb-0" style={{ color: '#212529' }}>
                <i className="bi bi-calendar-check me-2 text-info"></i>
                Recent Attendance
              </h5>
              <Link to="/attendance" className="btn btn-sm btn-primary">
                <i className="bi bi-eye me-1"></i> View All
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Course</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.slice(0, 5).map((record) => (
                      <tr key={record.AttendanceID}>
                        <td className="fw-semibold" style={{ color: '#212529' }}>
                          {record.CourseTitle || 'Course'}
                        </td>
                        <td style={{ color: '#6c757d' }}>
                          {record.Date ? new Date(record.Date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(record.Status)}`}>
                            {record.Status || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;