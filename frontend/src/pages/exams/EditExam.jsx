// pages/exams/EditExam.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExamById, updateExam } from '../../services/examService';
import { getSections } from '../../services/sectionService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditExam = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  // ✅ FIX: Allow Admin and Teacher to edit exams
  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin' && user.role !== 'Teacher') {
      notifyError('Access denied. Only Admin and Teachers can edit exams.');
      navigate('/exams');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    sectionId: '',
    examName: '',
    examDate: '',
    maxMarks: '',
    weightage: '',
  });

  const [errors, setErrors] = useState({});

  const { data: examResponse, isLoading: loadingExam } = useQuery({
    queryKey: ['exam', id],
    queryFn: () => getExamById(id),
    enabled: !!id,
  });

  const { data: sectionsResponse, isLoading: loadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
  });

  let sections = [];
  if (sectionsResponse?.data && Array.isArray(sectionsResponse.data)) {
    sections = sectionsResponse.data;
  } else if (sectionsResponse?.data?.data && Array.isArray(sectionsResponse.data.data)) {
    sections = sectionsResponse.data.data;
  }

  useEffect(() => {
    if (examResponse?.data) {
      const e = examResponse.data;
      setFormData({
        sectionId: e.SectionID || '',
        examName: e.ExamName || '',
        examDate: e.ExamDate ? e.ExamDate.split('T')[0] : '',
        maxMarks: e.MaxMarks || '',
        weightage: e.Weightage || '',
      });
    }
  }, [examResponse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sectionId) newErrors.sectionId = 'Section is required';
    if (!formData.examName?.trim()) newErrors.examName = 'Exam name is required';
    if (!formData.maxMarks) newErrors.maxMarks = 'Max marks is required';
    if (formData.maxMarks && (formData.maxMarks < 1 || formData.maxMarks > 1000)) {
      newErrors.maxMarks = 'Max marks must be between 1 and 1000';
    }
    if (formData.weightage && (formData.weightage < 0 || formData.weightage > 100)) {
      newErrors.weightage = 'Weightage must be between 0 and 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        SectionID: parseInt(data.sectionId),
        ExamName: data.examName,
        ExamDate: data.examDate || null,
        MaxMarks: parseInt(data.maxMarks),
        Weightage: data.weightage ? parseInt(data.weightage) : null,
      };
      return updateExam(id, payload);
    },
    onSuccess: () => {
      success('Exam updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['exams'] });
      queryClient.invalidateQueries({ queryKey: ['exam', id] });
      navigate('/exams');
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Update failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateMutation.mutate(formData);
  };

  const isLoading = loadingExam || updateMutation.isLoading;

  if (loadingExam) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading exam data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit Exam
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Update exam information</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/exams')}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Section <span className="text-danger">*</span>
                </label>
                <select
                  name="sectionId"
                  className={`form-select ${errors.sectionId ? 'is-invalid' : ''}`}
                  value={formData.sectionId}
                  onChange={handleChange}
                  disabled={loadingSections}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Section</option>
                  {sections.map((section) => (
                    <option key={section.SectionID} value={section.SectionID}>
                      {section.SectionName} - {section.CourseTitle}
                    </option>
                  ))}
                </select>
                {errors.sectionId && <div className="invalid-feedback">{errors.sectionId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Exam Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="examName"
                  className={`form-control ${errors.examName ? 'is-invalid' : ''}`}
                  value={formData.examName}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.examName && <div className="invalid-feedback">{errors.examName}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Exam Date</label>
                <input
                  type="date"
                  name="examDate"
                  className="form-control"
                  value={formData.examDate}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Max Marks <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="maxMarks"
                  className={`form-control ${errors.maxMarks ? 'is-invalid' : ''}`}
                  value={formData.maxMarks}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.maxMarks && <div className="invalid-feedback">{errors.maxMarks}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Weightage (%)</label>
                <input
                  type="number"
                  name="weightage"
                  className={`form-control ${errors.weightage ? 'is-invalid' : ''}`}
                  value={formData.weightage}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.weightage && <div className="invalid-feedback">{errors.weightage}</div>}
              </div>
            </div>

            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/exams')}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i>
                    Update Exam
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

export default EditExam;