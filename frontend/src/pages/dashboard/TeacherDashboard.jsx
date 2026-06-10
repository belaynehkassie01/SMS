// pages/dashboard/TeacherDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { getSections } from '../../services/sectionService';
import { getExams } from '../../services/examService';
import { getAttendance } from '../../services/attendanceService';
import { useNotification } from '../../context/NotificationContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const { error: notifyError } = useNotification();
  const today = new Date().toLocaleDateString();

  // Query configuration to prevent excessive requests
  const queryConfig = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
    retry: 1,
    retryDelay: 1000,
  };

  // Fetch sections - without teacherId filter (use your original logic)
  const { 
    data: sectionsData, 
    isLoading: loadingSections,
    error: sectionsError 
  } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
    ...queryConfig,
  });

  // Fetch exams - without teacherId filter
  const { 
    data: examsData, 
    isLoading: loadingExams,
    error: examsError 
  } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
    ...queryConfig,
  });

  // Fetch attendance - without teacherId filter
  const { 
    data: attendanceData, 
    isLoading: loadingAttendance,
    error: attendanceError 
  } = useQuery({
    queryKey: ['attendance'],
    queryFn: getAttendance,
    ...queryConfig,
  });

  // Safe data extraction
  let sections = [];
  let exams = [];
  let attendance = [];

  // Extract sections data
  if (sectionsData?.data && Array.isArray(sectionsData.data)) {
    sections = sectionsData.data;
  } else if (sectionsData?.data?.data && Array.isArray(sectionsData.data.data)) {
    sections = sectionsData.data.data;
  } else if (Array.isArray(sectionsData)) {
    sections = sectionsData;
  }

  // Extract exams data
  if (examsData?.data && Array.isArray(examsData.data)) {
    exams = examsData.data;
  } else if (examsData?.data?.data && Array.isArray(examsData.data.data)) {
    exams = examsData.data.data;
  } else if (Array.isArray(examsData)) {
    exams = examsData;
  }

  // Extract attendance data
  if (attendanceData?.data && Array.isArray(attendanceData.data)) {
    attendance = attendanceData.data;
  } else if (attendanceData?.data?.data && Array.isArray(attendanceData.data.data)) {
    attendance = attendanceData.data.data;
  } else if (Array.isArray(attendanceData)) {
    attendance = attendanceData;
  }

  // Debug logs to see what data is coming
  console.log('Sections data:', sectionsData);
  console.log('Exams data:', examsData);
  console.log('Attendance data:', attendanceData);
  console.log('Extracted sections:', sections);
  console.log('Extracted exams:', exams);
  console.log('Extracted attendance:', attendance);

  // Calculate stats
  const stats = {
    totalSections: sections.length || 0,
    upcomingExams: exams.filter(e => e.ExamDate && new Date(e.ExamDate) > new Date()).length || 0,
    todayClasses: sections.length || 0,
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
  if (loadingSections || loadingExams || loadingAttendance) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading dashboard...</p>
      </div>
    );
  }

  // Show error state
  if (sectionsError || examsError || attendanceError) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading dashboard data: {(sectionsError || examsError || attendanceError)?.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-chalkboard me-2 text-primary"></i>
            Teacher Dashboard
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>
            Welcome back, {user?.fullName || user?.username || 'Teacher'}!
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
              <i className="bi bi-layout-text-window fs-1 text-primary"></i>
              <h5 className="mt-2" style={{ color: '#212529' }}>My Sections</h5>
              <h2 className="text-primary">{stats.totalSections}</h2>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center">
              <i className="bi bi-file-text fs-1 text-warning"></i>
              <h5 className="mt-2" style={{ color: '#212529' }}>Upcoming Exams</h5>
              <h2 className="text-warning">{stats.upcomingExams}</h2>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center">
              <i className="bi bi-calendar-check fs-1 text-info"></i>
              <h5 className="mt-2" style={{ color: '#212529' }}>Today's Classes</h5>
              <h2 className="text-info">{stats.todayClasses}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <Link to="/attendance/create" className="text-decoration-none">
            <div className="card border-0 shadow-sm bg-primary text-white" style={{ borderRadius: '12px' }}>
              <div className="card-body text-center py-3">
                <i className="bi bi-calendar-check fs-2"></i>
                <p className="mb-0 mt-1 fw-semibold">Mark Attendance</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/exams/create" className="text-decoration-none">
            <div className="card border-0 shadow-sm bg-success text-white" style={{ borderRadius: '12px' }}>
              <div className="card-body text-center py-3">
                <i className="bi bi-file-text fs-2"></i>
                <p className="mb-0 mt-1 fw-semibold">Create Exam</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-4">
          <Link to="/results/create" className="text-decoration-none">
            <div className="card border-0 shadow-sm bg-warning text-white" style={{ borderRadius: '12px' }}>
              <div className="card-body text-center py-3">
                <i className="bi bi-trophy fs-2"></i>
                <p className="mb-0 mt-1 fw-semibold">Add Results</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* My Sections List */}
      <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-header bg-white border-bottom" style={{ backgroundColor: '#ffffff !important' }}>
          <h5 className="mb-0" style={{ color: '#212529' }}>
            <i className="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>
            My Sections
          </h5>
        </div>
        <div className="card-body">
          {!sections || sections.length === 0 ? (
            <div className="text-center py-4" style={{ color: '#6c757d' }}>
              <i className="bi bi-inbox fs-1"></i>
              <p className="mt-2">No sections assigned</p>
            </div>
          ) : (
            <div className="row g-3">
              {sections.map((section, index) => (
                <div key={section.SectionID || index} className="col-md-6 col-lg-4">
                  <div className="card h-100 border" style={{ backgroundColor: '#ffffff' }}>
                    <div className="card-body">
                      <h6 className="card-title fw-semibold" style={{ color: '#212529' }}>
                        {section.SectionName || section.name || `Section ${section.SectionID || index + 1}`}
                      </h6>
                      <p className="card-text small mb-1" style={{ color: '#6c757d' }}>
                        {section.CourseTitle || section.courseTitle || 'No Course'}
                      </p>
                      <p className="card-text small" style={{ color: '#6c757d' }}>
                        <i className="bi bi-people me-1"></i> {section.Capacity || section.capacity || 0} students
                      </p>
                      <div className="d-flex gap-2 mt-2">
                        <Link to={`/sections/view/${section.SectionID || section.id}`} className="btn btn-sm btn-outline-primary">
                          <i className="bi bi-eye me-1"></i> View
                        </Link>
                        <Link to={`/attendance/create?section=${section.SectionID || section.id}`} className="btn btn-sm btn-outline-success">
                          <i className="bi bi-calendar-check me-1"></i> Mark Attendance
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card-footer bg-white text-center">
          <Link to="/sections" className="btn btn-sm btn-link">
            View All Sections <i className="bi bi-chevron-right"></i>
          </Link>
        </div>
      </div>

      {/* Exams and Attendance Row */}
      <div className="row g-3">
        {/* Upcoming Exams */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#ffffff !important' }}>
              <h5 className="mb-0" style={{ color: '#212529' }}>
                <i className="bi bi-calendar-event me-2 text-danger"></i>
                Upcoming Exams
              </h5>
              <Link to="/exams/create" className="btn btn-sm btn-primary">
                <i className="bi bi-plus-circle me-1"></i> Create
              </Link>
            </div>
            <div className="card-body p-0">
              {!exams || exams.length === 0 ? (
                <div className="text-center py-4" style={{ color: '#6c757d' }}>
                  <i className="bi bi-inbox fs-1"></i>
                  <p className="mt-2 mb-0">No exams found</p>
                </div>
              ) : exams.filter(e => e.ExamDate && new Date(e.ExamDate) > new Date()).length === 0 ? (
                <div className="text-center py-4" style={{ color: '#6c757d' }}>
                  <i className="bi bi-inbox fs-1"></i>
                  <p className="mt-2 mb-0">No upcoming exams</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {exams
                    .filter(e => e.ExamDate && new Date(e.ExamDate) > new Date())
                    .slice(0, 5)
                    .map((exam, index) => (
                      <div key={exam.ExamID || index} className="list-group-item d-flex justify-content-between align-items-center" style={{ backgroundColor: '#ffffff' }}>
                        <div>
                          <h6 className="mb-1 fw-semibold" style={{ color: '#212529' }}>{exam.ExamName || exam.name || 'Exam'}</h6>
                          <small style={{ color: '#6c757d' }}>
                            {exam.CourseTitle || exam.courseTitle || 'Course'} - {exam.SectionName || exam.sectionName || 'Section'}
                          </small>
                        </div>
                        <div className="text-end">
                          <span className="badge bg-info">
                            {exam.ExamDate ? new Date(exam.ExamDate).toLocaleDateString() : 'TBD'}
                          </span>
                          <div className="mt-1">
                            <Link to={`/exams/edit/${exam.ExamID || exam.id}`} className="btn btn-sm btn-outline-primary me-1">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <Link to={`/results/create?exam=${exam.ExamID || exam.id}`} className="btn btn-sm btn-outline-success">
                              <i className="bi bi-trophy"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="card-footer bg-white text-center">
              <Link to="/exams" className="btn btn-sm btn-link">
                View All Exams <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Attendance */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center" style={{ backgroundColor: '#ffffff !important' }}>
              <h5 className="mb-0" style={{ color: '#212529' }}>
                <i className="bi bi-clock-history me-2 text-info"></i>
                Recent Attendance
              </h5>
              <Link to="/attendance/create" className="btn btn-sm btn-primary">
                <i className="bi bi-plus-circle me-1"></i> Mark
              </Link>
            </div>
            <div className="card-body p-0">
              {!attendance || attendance.length === 0 ? (
                <div className="text-center py-4" style={{ color: '#6c757d' }}>
                  <i className="bi bi-inbox fs-1"></i>
                  <p className="mt-2 mb-0">No attendance records</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Student</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.slice(0, 5).map((record, index) => (
                        <tr key={record.AttendanceID || index}>
                          <td className="fw-semibold" style={{ color: '#white' }}>
                            {record.StudentName || `${record.FirstName || ''} ${record.LastName || ''}`.trim() || '-'}
                           </td>
                          <td>
                            <span className={`badge ${getStatusBadge(record.Status)}`}>
                              {record.Status || '-'}
                            </span>
                          </td>
                          <td style={{ color: '#6c757d' }}>
                            {record.Date ? new Date(record.Date).toLocaleDateString() : '-'}
                          </td>
                          <td>
                            <Link to={`/attendance/edit/${record.AttendanceID || record.id}`} className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="card-footer bg-white text-center">
              <Link to="/attendance" className="btn btn-sm btn-link">
                View All Attendance <i className="bi bi-chevron-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;