// pages/courses/CourseList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses, deleteCourse } from '../../services/courseService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const CourseList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: () => getCourses(),
  });

  console.log('Full API Response:', data);
  console.log('data?.data:', data?.data);

  // Extract courses array - handle different response structures
  let courses = [];
  if (data?.data && Array.isArray(data?.data)) {
    courses = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    courses = data.data.data;
  } else if (Array.isArray(data)) {
    courses = data;
  }
  
  console.log('Extracted courses:', courses);
  console.log('Courses count:', courses.length);

  // Filter courses based on search input (frontend filtering)
  useEffect(() => {
    if (courses.length > 0) {
      if (search.trim() === '') {
        setFilteredCourses(courses);
      } else {
        const filtered = courses.filter(course => 
          course.CourseCode?.toLowerCase().includes(search.toLowerCase()) ||
          course.Title?.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCourses(filtered);
      }
    } else {
      setFilteredCourses([]);
    }
  }, [search, courses]);

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: async () => {
      success('Course deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete course');
    },
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete course: ${title}?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Handle refresh button
  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Courses refreshed successfully');
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
        Error loading courses: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 text-white">
            <i className="bi bi-book me-2 text-primary"></i>
            Course Management
          </h2>
          <p className="text-secondary mb-0 mt-1">Manage all course records</p>
        </div>
        {user?.role === 'Admin' && (
          <Link to="/courses/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add New Course
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
                  placeholder="Search by course code or title..."
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

      {/* Courses Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Course Code</th>
                  <th>Course Title</th>
                  <th>Credits</th>
                  <th>Department</th>
                  <th>Description</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-secondary">
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      {search ? 'No courses match your search' : 'No courses found'}
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => (
                    <tr key={course.CourseID}>
                      <td className="text-white">{course.CourseID}</td>
                      <td className="text-white fw-semibold">{course.CourseCode}</td>
                      <td className="text-white">{course.Title}</td>
                      <td className="text-white">{course.Credits}</td>
                      <td className="text-white">{course.DeptName || '-'}</td>
                      <td className="text-white">
                        {course.Description?.length > 50 
                          ? `${course.Description.substring(0, 50)}...` 
                          : course.Description || '-'}
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/courses/view/${course.CourseID}`}
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {user?.role === 'Admin' && (
                            <>
                              <Link
                                to={`/courses/edit/${course.CourseID}`}
                                className="btn btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(course.CourseID, course.Title)}
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
        Showing {filteredCourses.length} of {courses.length} courses
      </div>
    </div>
  );
};

export default CourseList;