// pages/sections/EditSection.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSectionById, updateSection } from '../../services/sectionService';
import { getCourses } from '../../services/courseService';
import { getAcademicYears } from '../../services/academicYearService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditSection = () => {
  const { id } = useParams();
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
    academicYearId: '',
    semester: '',
    roomNumber: '',
    schedule: '',
    capacity: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch section data
  const { data: sectionResponse, isLoading: loadingSection } = useQuery({
    queryKey: ['section', id],
    queryFn: () => getSectionById(id),
    enabled: !!id,
  });

  // Fetch courses
  const { data: coursesResponse, isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  // Fetch academic years
  const { data: academicYearsResponse, isLoading: loadingAcademicYears } = useQuery({
    queryKey: ['academicYears'],
    queryFn: getAcademicYears,
  });

  // Extract data
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

  // Populate form when data is loaded
  useEffect(() => {
    if (sectionResponse?.data) {
      const s = sectionResponse.data;
      setFormData({
        sectionName: s.SectionName || '',
        courseId: s.CourseID || '',
        academicYearId: s.AcademicYearID || '',
        semester: s.Semester || '',
        roomNumber: s.RoomNumber || '',
        schedule: s.Schedule || '',
        capacity: s.Capacity || '',
      });
    }
  }, [sectionResponse]);

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

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        SectionName: data.sectionName,
        CourseID: parseInt(data.courseId),
        AcademicYearID: parseInt(data.academicYearId),
        Semester: data.semester || null,
        RoomNumber: data.roomNumber || null,
        Schedule: data.schedule || null,
        Capacity: data.capacity ? parseInt(data.capacity) : null,
      };
      console.log('Updating section with payload:', payload);
      return updateSection(id, payload);
    },
    onSuccess: () => {
      success('Section updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['sections'] });
      queryClient.invalidateQueries({ queryKey: ['section', id] });
      navigate('/sections');
    },
    onError: (err) => {
      console.error('Update error:', err);
      notifyError(err?.response?.data?.message || 'Update failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateMutation.mutate(formData);
  };

  const isLoading = loadingSection || updateMutation.isLoading;

  if (loadingSection) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading section data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold text-dark">
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit Section
          </h2>
          <p className="text-secondary mb-0">Update section information</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/sections')}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body bg-white p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">
                  Section Name <span className="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                    name="sectionName" 
                  className={`form-control bg-white text-dark ${errors.sectionName ? 'is-invalid' : ''}`} 
                  value={formData.sectionName} 
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.sectionName && <div className="invalid-feedback">{errors.sectionName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium text-dark">
                  Course <span className="text-danger">*</span>
                </label>
                <select 
                  name="courseId" 
                  className={`form-select bg-white text-dark ${errors.courseId ? 'is-invalid' : ''}`} 
                  value={formData.courseId} 
                  onChange={handleChange}
                  disabled={loadingCourses}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
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
                <label className="form-label fw-medium text-dark">
                  Academic Year <span className="text-danger">*</span>
                </label>
                <select 
                  name="academicYearId" 
                  className={`form-select bg-white text-dark ${errors.academicYearId ? 'is-invalid' : ''}`} 
                  value={formData.academicYearId} 
                  onChange={handleChange}
                  disabled={loadingAcademicYears}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
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
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
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
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
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
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
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
                  min="1"
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/sections')} 
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Update Section'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSection;