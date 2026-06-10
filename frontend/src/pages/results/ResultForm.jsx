// pages/results/ResultForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createResult } from '../../services/resultService';
import { getEnrollments } from '../../services/enrollmentService';
import { getExams } from '../../services/examService';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const ResultForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin' && user?.role !== 'Teacher') {
      notifyError('Access denied. Only Admin and Teachers can add results.');
      navigate('/results');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    enrollmentId: '',
    examId: '',
    obtainedMarks: '',
    grade: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});
  const [maxMarks, setMaxMarks] = useState(0);

  // Fetch enrollments
  const { data: enrollmentsResponse, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['enrollments'],
    queryFn: getEnrollments,
  });

  // Fetch exams
  const { data: examsResponse, isLoading: loadingExams } = useQuery({
    queryKey: ['exams'],
    queryFn: getExams,
  });

  let enrollments = [];
  if (enrollmentsResponse?.data && Array.isArray(enrollmentsResponse.data)) {
    enrollments = enrollmentsResponse.data;
  } else if (enrollmentsResponse?.data?.data && Array.isArray(enrollmentsResponse.data.data)) {
    enrollments = enrollmentsResponse.data.data;
  }

  let exams = [];
  if (examsResponse?.data && Array.isArray(examsResponse.data)) {
    exams = examsResponse.data;
  } else if (examsResponse?.data?.data && Array.isArray(examsResponse.data.data)) {
    exams = examsResponse.data.data;
  }

  // Get selected exam and update maxMarks
  const selectedExam = exams.find(e => e.ExamID === parseInt(formData.examId));

  useEffect(() => {
    if (selectedExam) {
      setMaxMarks(selectedExam.MaxMarks || 0);
      // Recalculate grade when exam changes
      if (formData.obtainedMarks) {
        const newGrade = calculateGrade(parseFloat(formData.obtainedMarks), selectedExam.MaxMarks);
        setFormData(prev => ({ ...prev, grade: newGrade }));
      }
    } else {
      setMaxMarks(0);
    }
  }, [formData.examId, selectedExam]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Function to calculate grade based on marks percentage
  const calculateGrade = (obtainedMarks, maxMarksValue) => {
    if (!obtainedMarks || !maxMarksValue || maxMarksValue === 0) return '';
    const percentage = (obtainedMarks / maxMarksValue) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 75) return 'B+';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  // Auto-calculate grade when obtained marks change
  const handleObtainedMarksChange = (e) => {
    const value = e.target.value;
    const numericValue = parseFloat(value);
    
    let calculatedGrade = '';
    if (numericValue && maxMarks > 0) {
      calculatedGrade = calculateGrade(numericValue, maxMarks);
    }
    
    setFormData(prev => ({
      ...prev,
      obtainedMarks: value,
      grade: calculatedGrade
    }));
    if (errors.obtainedMarks) setErrors(prev => ({ ...prev, obtainedMarks: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.enrollmentId) newErrors.enrollmentId = 'Enrollment is required';
    if (!formData.examId) newErrors.examId = 'Exam is required';
    if (!formData.obtainedMarks) newErrors.obtainedMarks = 'Obtained marks is required';
    if (formData.obtainedMarks && maxMarks && (formData.obtainedMarks < 0 || formData.obtainedMarks > maxMarks)) {
      newErrors.obtainedMarks = `Obtained marks must be between 0 and ${maxMarks}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        EnrollmentID: parseInt(data.enrollmentId),
        ExamID: parseInt(data.examId),
        ObtainedMarks: parseFloat(data.obtainedMarks),
        Grade: data.grade,
        Remarks: data.remarks || null,
      };
      console.log('Creating result with payload:', payload);
      return createResult(payload);
    },
    onSuccess: () => {
      success('Result created successfully');
      queryClient.invalidateQueries({ queryKey: ['results'] });
      navigate('/results');
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
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-trophy me-2 text-primary"></i>
            Create New Result
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Enter student exam result details</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/results')}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Enrollment <span className="text-danger">*</span>
                </label>
                <select
                  name="enrollmentId"
                  className={`form-select ${errors.enrollmentId ? 'is-invalid' : ''}`}
                  value={formData.enrollmentId}
                  onChange={handleChange}
                  disabled={loadingEnrollments}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Enrollment</option>
                  {enrollments.map((enrollment) => (
                    <option key={enrollment.EnrollmentID} value={enrollment.EnrollmentID}>
                      {enrollment.FirstName} {enrollment.LastName} - {enrollment.CourseTitle} ({enrollment.SectionName})
                    </option>
                  ))}
                </select>
                {errors.enrollmentId && <div className="invalid-feedback">{errors.enrollmentId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Exam <span className="text-danger">*</span>
                </label>
                <select
                  name="examId"
                  className={`form-select ${errors.examId ? 'is-invalid' : ''}`}
                  value={formData.examId}
                  onChange={handleChange}
                  disabled={loadingExams}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Exam</option>
                  {exams.map((exam) => (
                    <option key={exam.ExamID} value={exam.ExamID}>
                      {exam.ExamName} - {exam.CourseTitle} (Max: {exam.MaxMarks})
                    </option>
                  ))}
                </select>
                {errors.examId && <div className="invalid-feedback">{errors.examId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Obtained Marks <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="obtainedMarks"
                  className={`form-control ${errors.obtainedMarks ? 'is-invalid' : ''}`}
                  value={formData.obtainedMarks}
                  onChange={handleObtainedMarksChange}
                  step="0.01"
                  min="0"
                  max={maxMarks || 100}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {maxMarks > 0 && (
                  <small className="text-muted">Max marks: {maxMarks}</small>
                )}
                {errors.obtainedMarks && <div className="invalid-feedback">{errors.obtainedMarks}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Grade</label>
                <input
                  type="text"
                  name="grade"
                  className="form-control"
                  value={formData.grade}
                  readOnly
                  style={{ backgroundColor: '#f8f9fa', color: '#212529', border: '1px solid #ced4da' }}
                />
                <small className="text-muted">Auto-calculated based on marks</small>
              </div>

              <div className="col-12">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Remarks</label>
                <textarea
                  name="remarks"
                  className="form-control"
                  rows="3"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Additional comments about the result..."
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                ></textarea>
              </div>
            </div>

            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/results')}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-1"></i>
                    Create Result
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

export default ResultForm;