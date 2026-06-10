// pages/sections/SectionForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection } from '../../services/sectionService';
import { getCourses } from '../../services/courseService';
import { getAcademicYears } from '../../services/academicYearService';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const SectionForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/sections');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    sectionName: '',
    courseId: '',
    academicYearId: '',  // Changed from year to academicYearId
    semester: '',
    roomNumber: '',
    schedule: '',
    capacity: '',
  });

  const [errors, setErrors] = useState({});

  const { data: coursesResponse, isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const { data: academicYearsResponse, isLoading: loadingAcademicYears } = useQuery({
    queryKey: ['academicYears'],
    queryFn: getAcademicYears,
  });

  let courses = [];
  if (coursesResponse?.data && Array.isArray(coursesResponse.data)) {
    courses = coursesResponse.data;
  } else if (coursesResponse?.data?.data && Array.isArray(coursesResponse.data.data)) {
    courses = coursesResponse.data.data;
  }

  let academicYears = [];
  if (academicYearsResponse?.data && Array.isArray(academicYearsResponse.data)) {
    academicYears = academicYearsResponse.data;
  } else if (academicYearsResponse?.data?.data && Array.isArray(academicYearsResponse.data.data)) {
    academicYears = academicYearsResponse.data.data;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sectionName?.trim()) newErrors.sectionName = 'Section name is required';
    if (!formData.courseId) newErrors.courseId = 'Course is required';
    if (!formData.academicYearId) newErrors.academicYearId = 'Academic year is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        SectionName: data.sectionName,
        CourseID: parseInt(data.courseId),
        AcademicYearID: parseInt(data.academicYearId),  // Send AcademicYearID
        Semester: data.semester || null,
        RoomNumber: data.roomNumber || null,
        Schedule: data.schedule || null,
        Capacity: data.capacity ? parseInt(data.capacity) : null,
      };
      console.log('Creating section with payload:', payload);
      return createSection(payload);
    },
    onSuccess: () => {
      success('Section created successfully');
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      navigate('/sections');
    },
    onError: (err) => {
      console.error('Create error:', err);
      notifyError(err?.response?.data?.message || 'Create failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    createMutation.mutate(formData);
  };

  const isLoading = createMutation.isLoading;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold text-dark">Create New Section</h2>
          <p className="text-secondary mb-0">Enter section details</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/sections')}>
          ← Back
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body bg-white p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">Section Name *</label>
                <input 
                  type="text" 
                  name="sectionName" 
                  className={`form-control bg-white text-dark ${errors.sectionName ? 'is-invalid' : ''}`} 
                  value={formData.sectionName} 
                  onChange={handleChange}
                  placeholder="e.g., Section A"
                />
                {errors.sectionName && <div className="invalid-feedback">{errors.sectionName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">Course *</label>
                <select 
                  name="courseId" 
                  className={`form-select bg-white text-dark ${errors.courseId ? 'is-invalid' : ''}`} 
                  value={formData.courseId} 
                  onChange={handleChange}
                  disabled={loadingCourses}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.CourseID} value={course.CourseID}>
                      {course.CourseCode} - {course.Title}
                    </option>
                  ))}
                </select>
                {errors.courseId && <div className="invalid-feedback">{errors.courseId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">Academic Year *</label>
                <select 
                  name="academicYearId" 
                  className={`form-select bg-white text-dark ${errors.academicYearId ? 'is-invalid' : ''}`} 
                  value={formData.academicYearId} 
                  onChange={handleChange}
                  disabled={loadingAcademicYears}
                >
                  <option value="">Select Academic Year</option>
                  {academicYears.map((year) => (
                    <option key={year.AcademicYearID} value={year.AcademicYearID}>
                      {year.Year} - {year.Semester}
                    </option>
                  ))}
                </select>
                {errors.academicYearId && <div className="invalid-feedback">{errors.academicYearId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">Semester</label>
                <select 
                  name="semester" 
                  className="form-select bg-white text-dark" 
                  value={formData.semester} 
                  onChange={handleChange}
                >
                  <option value="">Select Semester</option>
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium text-dark">Room Number</label>
                <input 
                  type="text" 
                  name="roomNumber" 
                  className="form-control bg-white text-dark" 
                  value={formData.roomNumber} 
                  onChange={handleChange}
                  placeholder="Room 201"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium text-dark">Schedule</label>
                <input 
                  type="text" 
                  name="schedule" 
                  className="form-control bg-white text-dark" 
                  value={formData.schedule} 
                  onChange={handleChange}
                  placeholder="Mon-Wed 10:00"
                />
              </div>

              <div className="col-md-4">
                <label className="form-label fw-medium text-dark">Capacity</label>
                <input 
                  type="number" 
                  name="capacity" 
                  className="form-control bg-white text-dark" 
                  value={formData.capacity} 
                  onChange={handleChange}
                  placeholder="30"
                />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/sections')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Section'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SectionForm;