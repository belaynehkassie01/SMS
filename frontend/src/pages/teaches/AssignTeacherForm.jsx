// src/pages/teaches/AssignTeacherForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeachers } from '../../services/teacherService';
import { getSections } from '../../services/sectionService';
import { getCourses } from '../../services/courseService';
import { createTeach } from '../../services/teachesService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const AssignTeacherForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    TeacherID: '',
    SectionID: '',
    CourseID: '',
    IsPrimaryTeacher: 1
  });

  // Fetch teachers
  const { data: teachersData, isLoading: loadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
    enabled: user?.role === 'Admin',
  });

  // Fetch sections
  const { data: sectionsData, isLoading: loadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
    enabled: user?.role === 'Admin',
  });

  // Fetch courses
  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    enabled: user?.role === 'Admin',
  });

  // Extract data
  let teachers = [];
  if (teachersData?.data && Array.isArray(teachersData.data)) {
    teachers = teachersData.data;
  } else if (teachersData?.data?.data && Array.isArray(teachersData.data.data)) {
    teachers = teachersData.data.data;
  }

  let sections = [];
  if (sectionsData?.data && Array.isArray(sectionsData.data)) {
    sections = sectionsData.data;
  } else if (sectionsData?.data?.data && Array.isArray(sectionsData.data.data)) {
    sections = sectionsData.data.data;
  }

  let courses = [];
  if (coursesData?.data && Array.isArray(coursesData.data)) {
    courses = coursesData.data;
  } else if (coursesData?.data?.data && Array.isArray(coursesData.data.data)) {
    courses = coursesData.data.data;
  }

  const createMutation = useMutation({
    mutationFn: createTeach,
    onSuccess: () => {
      success('Teacher assigned successfully');
      queryClient.invalidateQueries({ queryKey: ['teaches'] });
      navigate('/teaches');
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to assign teacher');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.TeacherID || !formData.SectionID || !formData.CourseID) {
      notifyError('Please select teacher, course, and section');
      return;
    }
    
    const payload = {
      TeacherID: parseInt(formData.TeacherID),
      SectionID: parseInt(formData.SectionID),
      CourseID: parseInt(formData.CourseID),
      IsPrimaryTeacher: formData.IsPrimaryTeacher
    };
    
    console.log('Sending payload:', payload);
    createMutation.mutate(payload);
  };

  if (loadingTeachers || loadingSections || loadingCourses) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-person-plus me-2 text-primary"></i>
            Assign Teacher to Section
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>
            Link a teacher to a course section
          </p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/teaches')}>
          ← Back to Assignments
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Select Teacher */}
              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Select Teacher <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.TeacherID}
                  onChange={(e) => setFormData({...formData, TeacherID: e.target.value})}
                  required
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Choose a teacher...</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.TeacherID} value={teacher.TeacherID}>
                      {teacher.FirstName} {teacher.LastName}
                    </option>
                  ))}
                </select>
                <small className="text-muted">Select the teacher to assign</small>
              </div>

              {/* Select Course */}
              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Select Course <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.CourseID}
                  onChange={(e) => setFormData({...formData, CourseID: e.target.value})}
                  required
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Choose a course...</option>
                  {courses.map((course) => (
                    <option key={course.CourseID} value={course.CourseID}>
                      {course.Title}
                    </option>
                  ))}
                </select>
                <small className="text-muted">Select the course</small>
              </div>

              {/* Select Section - Always Active */}
              <div className="col-md-4">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Select Section <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.SectionID}
                  onChange={(e) => setFormData({...formData, SectionID: e.target.value})}
                  required
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Choose a section...</option>
                  {sections.map((section) => (
                    <option key={section.SectionID} value={section.SectionID}>
                      {section.SectionName}
                    </option>
                  ))}
                </select>
                <small className="text-muted">Select the section</small>
              </div>

              {/* Teacher Type */}
              <div className="col-md-12">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Teacher Type
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="primaryTeacher"
                      value={1}
                      checked={formData.IsPrimaryTeacher === 1}
                      onChange={(e) => setFormData({...formData, IsPrimaryTeacher: parseInt(e.target.value)})}
                    />
                    <label className="form-check-label" htmlFor="primaryTeacher">
                      Primary Teacher
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      id="secondaryTeacher"
                      value={0}
                      checked={formData.IsPrimaryTeacher === 0}
                      onChange={(e) => setFormData({...formData, IsPrimaryTeacher: parseInt(e.target.value)})}
                    />
                    <label className="form-check-label" htmlFor="secondaryTeacher">
                      Secondary Teacher
                    </label>
                  </div>
                </div>
                <small className="text-muted">Primary teachers have full access, secondary teachers have limited access</small>
              </div>
            </div>

            {/* Selected items summary */}
            {formData.TeacherID && formData.CourseID && formData.SectionID && (
              <div className="alert alert-success mt-4" style={{ borderRadius: '12px' }}>
                <i className="bi bi-check-circle me-2"></i>
                <strong>Assignment Summary:</strong><br />
                Teacher: {teachers.find(t => t.TeacherID == formData.TeacherID)?.FirstName} {teachers.find(t => t.TeacherID == formData.TeacherID)?.LastName}<br />
                Course: {courses.find(c => c.CourseID == formData.CourseID)?.Title}<br />
                Section: {sections.find(s => s.SectionID == formData.SectionID)?.SectionName}<br />
                Role: {formData.IsPrimaryTeacher === 1 ? 'Primary Teacher' : 'Secondary Teacher'}
              </div>
            )}

            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/teaches')}
                disabled={createMutation.isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={createMutation.isLoading}
              >
                {createMutation.isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Assigning...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i>
                    Assign Teacher
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignTeacherForm;