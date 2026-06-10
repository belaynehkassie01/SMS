// pages/payments/PaymentList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPayments, deletePayment } from '../../services/paymentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const PaymentList = () => {
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [filteredPayments, setFilteredPayments] = useState([]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['payments'],
    queryFn: () => getPayments(),
  });

  console.log('Payments API Response:', data);

  // Extract payments from response
  let payments = [];
  if (data?.data && Array.isArray(data?.data)) {
    payments = data.data;
  } else if (data?.data?.data && Array.isArray(data?.data?.data)) {
    payments = data.data.data;
  } else if (Array.isArray(data)) {
    payments = data;
  }

  console.log('Extracted payments:', payments);

  // Filter payments based on search
  useEffect(() => {
    if (payments.length > 0) {
      if (search.trim() === '') {
        setFilteredPayments(payments);
      } else {
        const filtered = payments.filter(payment =>
          (payment.FirstName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (payment.LastName?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (payment.StudentNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
          (payment.Status?.toLowerCase() || '').includes(search.toLowerCase())
        );
        setFilteredPayments(filtered);
      }
    } else {
      setFilteredPayments([]);
    }
  }, [search, payments]);

  const deleteMutation = useMutation({
    mutationFn: deletePayment,
    onSuccess: async () => {
      success('Payment deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      refetch();
    },
    onError: (err) => {
      notifyError(err?.response?.data?.message || 'Failed to delete payment');
    },
  });

  const handleDelete = (id, studentName, amount) => {
    if (window.confirm(`Are you sure you want to delete payment of ${amount} for ${studentName}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleRefresh = () => {
    setSearch('');
    refetch();
    success('Payments refreshed successfully');
  };

  const getStatusBadgeColor = (status) => {
    if (status === 'Paid') return 'bg-success';
    if (status === 'Pending') return 'bg-warning text-dark';
    if (status === 'Overdue') return 'bg-danger';
    return 'bg-secondary';
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `ETB ${Number(amount).toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error loading payments: {error?.response?.data?.message || error.message}
      </div>
    );
  }

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-credit-card me-2 text-primary"></i>
            Payment Management
          </h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Manage student fee payments</p>
        </div>
        {user?.role === 'Admin' && (
          <Link to="/payments/create" className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-circle me-2"></i>Add Payment
          </Link>
        )}
      </div>

      {/* Search Bar */}
      <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0" style={{ color: '#6c757d' }}>
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  style={{ color: '#white', backgroundColor: '#ffffff' }}
                  placeholder="Search by student name, number or status..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearch('')}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-auto ms-auto">
              <button className="btn btn-outline-primary" onClick={handleRefresh}>
                <i className="bi bi-arrow-repeat me-1"></i>Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0">
              <thead className="table-dark">
                <tr>
                  <th style={{ width: '60px' }}>ID</th>
                  <th>Student Name</th>
                  <th>Student Number</th>
                  <th>Academic Year</th>
                  <th>Amount</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5" style={{ color: '#6c757d' }}>
                      <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                      {search ? 'No payments match your search' : 'No payments found'}
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.PaymentID}>
                      <td style={{ color: '#white' }}>{payment.PaymentID}</td>
                      <td className="fw-semibold" style={{ color: '#white' }}>
                        {`${payment.FirstName || ''} ${payment.LastName || ''}`.trim() || '-'}
                      </td>
                      <td style={{ color: '#white' }}>{payment.StudentNumber || '-'}</td>
                      <td style={{ color: '#white' }}>{payment.Year ? `${payment.Year} - ${payment.Semester}` : '-'}</td>
                      <td style={{ color: '#white', fontWeight: 'bold' }}>
                        {formatCurrency(payment.Amount)}
                      </td>
                      <td style={{ color: '#white' }}>
                        {payment.PaymentDate ? new Date(payment.PaymentDate).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeColor(payment.Status)}`}>
                          {payment.Status || 'Paid'}
                        </span>
                      </td>
                      <td style={{ color: '#white' }}>{payment.Remarks || '-'}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Link
                            to={`/payments/view/${payment.PaymentID}`}
                            className="btn btn-outline-info"
                            title="View Details"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          {user?.role === 'Admin' && (
                            <>
                              <Link
                                to={`/payments/edit/${payment.PaymentID}`}
                                className="btn btn-outline-primary"
                                title="Edit"
                              >
                                <i className="bi bi-pencil"></i>
                              </Link>
                              <button
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(payment.PaymentID, `${payment.FirstName} ${payment.LastName}`, formatCurrency(payment.Amount))}
                                disabled={deleteMutation.isLoading}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="text-center small mt-3" style={{ color: '#6c757d' }}>
        Showing {filteredPayments.length} of {payments.length} payments
      </div>
    </div>
  );
};

export default PaymentList;