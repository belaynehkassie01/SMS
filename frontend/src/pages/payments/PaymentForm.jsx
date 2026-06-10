// pages/payments/PaymentForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPayment } from '../../services/paymentService';
import { getStudents } from '../../services/studentService';
import { getAcademicYears } from '../../services/academicYearService';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const PaymentForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/payments');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    studentId: '',
    academicYearId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'Paid',
    remarks: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch students
  const { data: studentsResponse, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

  // Fetch academic years
  const { data: academicYearsResponse, isLoading: loadingAcademicYears } = useQuery({
    queryKey: ['academicYears'],
    queryFn: getAcademicYears,
  });

  let students = [];
  if (studentsResponse?.data && Array.isArray(studentsResponse.data)) {
    students = studentsResponse.data;
  } else if (studentsResponse?.data?.data && Array.isArray(studentsResponse.data.data)) {
    students = studentsResponse.data.data;
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
    if (!formData.studentId) newErrors.studentId = 'Student is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (formData.amount && (formData.amount <= 0)) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        StudentID: parseInt(data.studentId),
        AcademicYearID: data.academicYearId ? parseInt(data.academicYearId) : null,
        Amount: parseFloat(data.amount),
        PaymentDate: data.paymentDate,
        Status: data.status,
        Remarks: data.remarks || null,
      };
      console.log('Creating payment with payload:', payload);
      return createPayment(payload);
    },
    onSuccess: () => {
      success('Payment recorded successfully');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      navigate('/payments');
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
            <i className="bi bi-credit-card me-2 text-primary"></i>
            Record Payment
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Record student fee payment</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/payments')}>
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
                  name="studentId"
                  className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={loadingStudents}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.StudentID} value={student.StudentID}>
                      {student.FirstName} {student.LastName} ({student.StudentNumber})
                    </option>
                  ))}
                </select>
                {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Academic Year</label>
                <select
                  name="academicYearId"
                  className="form-select"
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
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Amount (ETB) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Enter amount"
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>
                  Payment Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  name="paymentDate"
                  className={`form-control ${errors.paymentDate ? 'is-invalid' : ''}`}
                  value={formData.paymentDate}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                />
                {errors.paymentDate && <div className="invalid-feedback">{errors.paymentDate}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-medium" style={{ color: '#212529' }}>Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
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
                onClick={() => navigate('/payments')}
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
                    <i className="bi bi-save me-1"></i>
                    Record Payment
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

export default PaymentForm;