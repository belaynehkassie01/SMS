// pages/attendance/EditAttendance.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttendanceById, updateAttendance } from '../../services/attendanceService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin' && user?.role !== 'Teacher') {
      notifyError('Access denied. Only Admin and Teachers can edit attendance.');
      navigate('/attendance');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    date: '',
    status: 'Present',
    checkInTime: '',
    checkOutTime: '',
    remarks: '',
  });

  const [errors, setErrors] = useState({});

  const { data: attendanceResponse, isLoading: loadingAttendance } = useQuery({
    queryKey: ['attendance', id],
    queryFn: () => getAttendanceById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (attendanceResponse?.data) {
      const a = attendanceResponse.data;
      setFormData({
        date: a.Date ? a.Date.split('T')[0] : '',
        status: a.Status || 'Present',
        checkInTime: a.CheckInTime || '',
        checkOutTime: a.CheckOutTime || '',
        remarks: a.Remarks || '',
      });
    }
  }, [attendanceResponse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        Date: data.date,
        Status: data.status,
        CheckInTime: data.checkInTime || null,
        CheckOutTime: data.checkOutTime || null,
        Remarks: data.remarks || null,
      };
      console.log('Updating attendance with payload:', payload);
      return updateAttendance(id, payload);
    },
    onSuccess: () => {
      success('Attendance updated successfully');
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['attendance', id] });
      navigate('/attendance');
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

  const isLoading = loadingAttendance || updateMutation.isLoading;

  if (loadingAttendance) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading attendance record...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit Attendance
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Update attendance record</p>
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
                  placeholder="Additional notes..."
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
                    Update Attendance
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

export default EditAttendance;