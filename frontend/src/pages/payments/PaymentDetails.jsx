// pages/payments/PaymentDetails.jsx
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getPaymentById } from '../../services/paymentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';
import PaymentReceipt from '../../components/common/PaymentTranscript';

const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: notifyError } = useNotification();
  const [showReceipt, setShowReceipt] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
  });

  console.log('Payment details response:', data);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading payment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading payment details: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  const payment = data?.data?.data || data?.data || {};

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `ETB ${Number(amount).toLocaleString()}`;
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'Paid') return 'bg-success';
    if (status === 'Pending') return 'bg-warning text-dark';
    if (status === 'Overdue') return 'bg-danger';
    return 'bg-secondary';
  };

  const studentName = `${payment.FirstName || ''} ${payment.LastName || ''}`.trim() || 'Student';

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-credit-card me-2 text-primary"></i>
            Payment Details
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>View complete payment information</p>
        </div>
        <div className="d-flex gap-2">
          {user?.role === 'Admin' && (
            <>
              <button 
                onClick={() => setShowReceipt(true)}
                className="btn btn-success"
              >
                <i className="bi bi-receipt me-2"></i>Print Receipt
              </button>
              <Link to={`/payments/edit/${id}`} className="btn btn-primary">
                <i className="bi bi-pencil me-2"></i>Edit
              </Link>
            </>
          )}
          <button className="btn btn-outline-secondary" onClick={() => navigate('/payments')}>
            <i className="bi bi-arrow-left me-2"></i>Back to List
          </button>
        </div>
      </div>

      <div className="row g-4">
        {/* Payment Info Card */}
        <div className="col-md-5">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-body text-center p-4">
              <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
                <i className="bi bi-credit-card fs-1 text-primary"></i>
              </div>
              <h3 className="mb-1 fw-semibold" style={{ color: '#1a1a2e' }}>
                {formatCurrency(payment.Amount)}
              </h3>
              <p className="mb-2" style={{ color: '#6c757d' }}>Payment ID: {payment.PaymentID || '-'}</p>
              <p className="mb-2" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                Student: {studentName}
              </p>
              <hr className="my-3" />
              <div className="row">
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Payment Date</small>
                  <div className="fw-bold" style={{ color: '#0d6efd' }}>{formatDate(payment.PaymentDate)}</div>
                </div>
                <div className="col-6">
                  <small className="d-block" style={{ color: '#6c757d' }}>Status</small>
                  <div className="mt-1">
                    <span className={`badge ${getStatusBadgeColor(payment.Status)} px-3 py-2`}>
                      {payment.Status || 'Paid'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div className="col-md-7">
          <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div className="card-header bg-white border-bottom" style={{ backgroundColor: '#ffffff' }}>
              <h5 className="mb-0" style={{ color: '#495057' }}>
                <i className="bi bi-info-circle me-2 text-primary"></i>
                Payment Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Payment ID</label>
                  <div className="fw-semibold" style={{ color: '#212529' }}>{payment.PaymentID || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Student Name</label>
                  <div style={{ color: '#212529' }}>{studentName}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Student Number</label>
                  <div style={{ color: '#212529' }}>{payment.StudentNumber || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Academic Year</label>
                  <div style={{ color: '#212529' }}>{payment.Year ? `${payment.Year} - ${payment.Semester}` : '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Amount</label>
                  <div className="fw-bold" style={{ color: '#212529' }}>{formatCurrency(payment.Amount)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Payment Date</label>
                  <div style={{ color: '#212529' }}>{formatDate(payment.PaymentDate)}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Status</label>
                  <div style={{ color: '#212529' }}>{payment.Status || '-'}</div>
                </div>
                <div className="col-12 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Remarks</label>
                  <div style={{ color: '#212529' }}>{payment.Remarks || '-'}</div>
                </div>
                <div className="col-sm-6 mb-3">
                  <label className="small mb-1 d-block" style={{ color: '#6c757d' }}>Created Date</label>
                  <div style={{ color: '#212529' }}>{formatDateTime(payment.CreatedAt)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Receipt Modal */}
      <PaymentReceipt
        show={showReceipt}
        onClose={() => setShowReceipt(false)}
        payment={payment}
        studentName={studentName}
      />
    </div>
  );
};

export default PaymentDetails;