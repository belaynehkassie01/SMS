// components/common/PaymentReceipt.jsx
import React from 'react';

const PaymentReceipt = ({ show, onClose, payment, studentName }) => {

  if (!show) return null;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return `ETB ${Number(amount).toLocaleString()}`;
  };

  const paymentDate = formatDate(payment.PaymentDate);
  const amount = formatCurrency(payment.Amount);
  const status = payment.Status || 'Paid';
  const remarks = payment.Remarks || '-';
  const academicYear = payment.Year ? `${payment.Year} - ${payment.Semester}` : '-';
  const studentNumber = payment.StudentNumber || '-';
  const receiptNumber = `RCP-${payment.PaymentID || Date.now()}`;
  const today = new Date();

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content').innerHTML;
    const originalContent = document.body.innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Receipt - ${studentName}</title>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #ffffff;
              color: #000000;
              padding: 20px;
            }
            .receipt-container {
              max-width: 500px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .mb-1 { margin-bottom: 5px; }
            .mb-2 { margin-bottom: 10px; }
            .mb-3 { margin-bottom: 15px; }
            .mt-2 { margin-top: 10px; }
            .mt-3 { margin-top: 15px; }
            hr { 
              border: none; 
              border-top: 1px solid #eee; 
              margin: 10px 0; 
            }
            table { 
              width: 100%; 
              font-size: 11px; 
            }
            td { 
              padding: 4px 0; 
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: bold;
              color: #ffffff;
            }
            .status-paid { background-color: #28a745; }
            .status-pending { background-color: #ffc107; color: #000000; }
            .status-overdue { background-color: #dc3545; }
            .amount { font-size: 18px; font-weight: bold; color: #28a745; }
            .total-amount { font-size: 16px; color: #28a745; }
            .footer-text { color: #999; font-size: 9px; }
            .school-name { font-size: 16px; font-weight: bold; }
            .school-tagline { font-size: 11px; }
            .school-address { font-size: 9px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal show d-block" tabIndex="-1" style={{ display: 'block' }}>
        <div className="modal-dialog modal-md modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="bi bi-receipt me-2"></i>
                Payment Receipt
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body p-3">
              {/* Receipt Content - Hidden div for print */}
              <div id="receipt-content" style={{ display: 'block' }}>
                {/* Header */}
                <div className="text-center mb-3">
                  <div className="school-name">SCHOOL MANAGEMENT SYSTEM</div>
                  <div className="school-tagline">Excellence in Education</div>
                  <div className="school-address">Addis Ababa, Ethiopia | info@sms.edu.et</div>
                </div>

                <hr />

                {/* Receipt Title */}
                <div className="text-center mb-3">
                  <div style={{ fontSize: '14px', fontWeight: 'bold' }}>PAYMENT RECEIPT</div>
                  <div style={{ fontSize: '10px' }}>{receiptNumber}</div>
                </div>

                {/* Status Badge */}
                <div className="text-center mb-3">
                  <span className={`status-badge ${status === 'Paid' ? 'status-paid' : status === 'Pending' ? 'status-pending' : 'status-overdue'}`}>
                    {status.toUpperCase()}
                  </span>
                </div>

                <hr />

                {/* Order Summary */}
                <div className="mb-2">
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>ORDER SUMMARY</div>
                  <table>
                    <tbody>
                      <tr><td style={{ width: '40%', color: '#666' }}>Receipt Number:</td><td className="text-right" style={{ fontWeight: 'bold' }}>{receiptNumber}</td></tr>
                      <tr><td style={{ color: '#666' }}>Receipt Date:</td><td className="text-right">{paymentDate}</td></tr>
                      <tr><td style={{ color: '#666' }}>Student Name:</td><td className="text-right" style={{ fontWeight: 'bold' }}>{studentName}</td></tr>
                      <tr><td style={{ color: '#666' }}>Student ID:</td><td className="text-right">{studentNumber}</td></tr>
                      <tr><td style={{ color: '#666' }}>Academic Year:</td><td className="text-right">{academicYear}</td></tr>
                      <tr><td style={{ color: '#666' }}>Received By:</td><td className="text-right">Finance Office</td></tr>
                    </tbody>
                  </table>
                </div>

                <hr />

                {/* Payment Details */}
                <div className="mb-2">
                  <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>PAYMENT DETAILS</div>
                  <table>
                    <tbody>
                      <tr><td style={{ color: '#666' }}>Description:</td><td className="text-right">Tuition Fee Payment</td></tr>
                      <tr><td style={{ color: '#666' }}>Amount Paid:</td><td className="text-right amount" style={{ fontSize: '14px' }}>{amount}</td></tr>
                      <tr><td style={{ color: '#666' }}>Payment Method:</td><td className="text-right">Bank Transfer / Cash</td></tr>
                      {remarks !== '-' && (
                        <tr><td style={{ color: '#666' }}>Remarks:</td><td className="text-right">{remarks}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <hr />

                {/* Total Amount */}
                <div className="mb-2">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                    <span>TOTAL AMOUNT PAID:</span>
                    <span className="total-amount">{amount}</span>
                  </div>
                </div>

                <hr />

                {/* Footer */}
                <div className="text-center">
                  <div className="footer-text">Thank you for your payment!</div>
                  <div className="footer-text">This is a computer-generated receipt. No signature is required.</div>
                  <div className="footer-text">Generated on: {today.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                <i className="bi bi-x-circle me-2"></i>Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePrint}>
                <i className="bi bi-printer me-2"></i>Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentReceipt;