// pages/attendance/MarkAttendance.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAttendance } from '../../services/attendanceService';
import { getEnrollments } from '../../services/enrollmentService';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const MarkAttendance = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin' && user?.role !== 'Teacher') {
      notifyError('Access denied. Only Admin and Teachers can mark attendance.');
      navigate('/attendance');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    enrollmentId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    checkInTime: '',
    checkOutTime: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch enrollments
  const { data: enrollmentsResponse, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['enrollments'],
    queryFn: getEnrollments,
  });

  let enrollments = [];
  if (enrollmentsResponse?.data && Array.isArray(enrollmentsResponse.data)) {
    enrollments = enrollmentsResponse.data;
  } else if (enrollmentsResponse?.data?.data && Array.isArray(enrollmentsResponse.data.data)) {
    enrollments = enrollmentsResponse.data.data;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.enrollmentId) newErrors.enrollmentId = 'Student enrollment is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        EnrollmentID: parseInt(data.enrollmentId),
        Date: data.date,
        Status: data.status,
        CheckInTime: data.checkInTime || null,
        CheckOutTime: data.checkOutTime || null,
        Remarks: data.remarks || null,
      };
      console.log('Marking attendance with payload:', payload);
      return createAttendance(payload);
    },
    onSuccess: () => {
      success('Attendance marked successfully');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      navigate('/attendance');
    },
    onError: (err) => {
      console.error('Mark attendance error:', err);
      notifyError(err?.response?.data?.message || 'Failed to mark attendance');
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
            <i className="bi bi-calendar-plus me-2 text-primary"></i>
            Mark Attendance
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Record student attendance</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/attendance')}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Student <span className="text-danger">*</span>
                </label>
                <select
                  name="enrollmentId"
                  className={`form-select ${errors.enrollmentId ? 'is-invalid' : ''}`}
                  value={formData.enrollmentId}
                  onChange={handleChange}
                  disabled={loadingEnrollments}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Student</option>
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
                  Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  value={formData.date}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Status <span className="text-danger">*</span>
                </label>
                <select
                  name="status"
                  className={`form-select ${errors.status ? 'is-invalid' : ''}`}
                  value={formData.status}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
              </div>

              <div className="col-md-3">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Check In Time</label>
                <input
                  type="time"
                  name="checkInTime"
                  className="form-control"
                  value={formData.checkInTime}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Check Out Time</label>
                <input
                  type="time"
                  name="checkOutTime"
                  className="form-control"
                  value={formData.checkOutTime}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Remarks</label>
                <textarea
                  name="remarks"
                  className="form-control"
                  rows="3"
                  value={formData.remarks}
                  onChange={handleChange}
                  placeholder="Additional notes (optional)..."
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                ></textarea>
              </div>
            </div>

            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => navigate('/attendance')}
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
                    Mark Attendance
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

export default MarkAttendance;