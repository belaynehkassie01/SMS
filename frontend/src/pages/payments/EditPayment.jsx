// pages/payments/EditPayment.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPaymentById, updatePayment } from '../../services/paymentService';
import { getStudents } from '../../services/studentService';
import { getAcademicYears } from '../../services/academicYearService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditPayment = () => {
  const { id } = useParams();
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
    paymentDate: '',
    status: 'Paid',
    remarks: '',
  });

  const [errors, setErrors] = useState({});

  const { data: paymentResponse, isLoading: loadingPayment } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  });

  const { data: studentsResponse, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  });

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

  useEffect(() => {
    if (paymentResponse?.data) {
      const p = paymentResponse.data;
      setFormData({
        studentId: p.StudentID || '',
        academicYearId: p.AcademicYearID || '',
        amount: p.Amount || '',
        paymentDate: p.PaymentDate ? p.PaymentDate.split('T')[0] : '',
        status: p.Status || 'Paid',
        remarks: p.Remarks || '',
      });
    }
  }, [paymentResponse]);

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

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        StudentID: parseInt(data.studentId),
        AcademicYearID: data.academicYearId ? parseInt(data.academicYearId) : null,
        Amount: parseFloat(data.amount),
        PaymentDate: data.paymentDate,
        Status: data.status,
        Remarks: data.remarks || null,
      };
      return updatePayment(id, payload);
    },
    onSuccess: () => {
      success('Payment updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payment', id] });
      navigate('/payments');
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

  const isLoading = loadingPayment || updateMutation.isLoading;

  if (loadingPayment) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading payment data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-pencil-square me-2 text-primary"></i>
            Edit Payment
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Update payment information</p>
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
                    <i className="bi bi-check-circle me-1"></i>
                    Update Payment
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

export default EditPayment;