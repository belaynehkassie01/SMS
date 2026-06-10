// src/pages/teaches/EditTeach.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeachById, updateTeach } from '../../services/teachesService';
import { getTeachers } from '../../services/teacherService';
import { getSections } from '../../services/sectionService';
import { getCourses } from '../../services/courseService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditTeach = () => {
  const { id } = useParams();
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

  // Fetch current assignment
  const { data: assignmentData, isLoading: loadingAssignment } = useQuery({
    queryKey: ['teaches', id],
    queryFn: () => getTeachById(id),
    enabled: !!id,
  });

  // Fetch teachers
  const { data: teachersData, isLoading: loadingTeachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  });

  // Fetch sections
  const { data: sectionsData, isLoading: loadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
  });

  // Fetch courses
  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  // Extract data
  let assignment = {};
  if (assignmentData?.data && typeof assignmentData.data === 'object') {
    assignment = assignmentData.data;
  } else if (assignmentData?.data?.data && typeof assignmentData.data.data === 'object') {
    assignment = assignmentData.data.data;
  }

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

  // Populate form when data loads
  useEffect(() => {
    if (assignment && Object.keys(assignment).length > 0) {
      setFormData({
        TeacherID: assignment.TeacherID || '',
        SectionID: assignment.SectionID || '',
        CourseID: assignment.CourseID || '',
        IsPrimaryTeacher: assignment.IsPrimaryTeacher === 1 ? 1 : 0
      });
    }
  }, [assignment]);

  const updateMutation = useMutation({
    mutationFn: (data) => updateTeach(id, data),
    onSuccess: () => {
      success('Assignment updated successfully');
      queryClient.invalidateQueries({ queryKey: ['teaches'] });
      queryClient.invalidateQueries({ queryKey: ['teaches', id] });
      navigate('/teaches');
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to update assignment');
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
    
    updateMutation.mutate(payload);
  };

  if (loadingAssignment || loadingTeachers || loadingSections || loadingCourses) {
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
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit Teacher Assignment
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>
            Update teacher to course/section assignment
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
              </div>

              {/* Select Section */}
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

            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/teaches')}
                disabled={updateMutation.isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-1"></i>
                    Update Assignment
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

export default EditTeach;