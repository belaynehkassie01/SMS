// components/common/CertificateModal.jsx
import React from 'react';

const CertificateModal = ({ show, onClose, studentName, studentId, examName, obtainedMarks, maxMarks, grade, percentage, gpa, year, message, date }) => {

  if (!show) return null;

  const getGradeColor = () => {
    if (!grade) return '#6c757d';
    const upperGrade = grade.toUpperCase();
    if (upperGrade.startsWith('A')) return '#28a745';
    if (upperGrade.startsWith('B')) return '#17a2b8';
    if (upperGrade.startsWith('C')) return '#ffc107';
    if (upperGrade.startsWith('D')) return '#fd7e14';
    return '#dc3545';
  };

  // Function to capitalize first letter of each word in student name
  const capitalizeName = (name) => {
    if (!name) return '';
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formattedStudentName = capitalizeName(studentName);

  const handlePrint = () => {
    const printContent = document.getElementById('certificate-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Achievement - ${formattedStudentName}</title>
          <meta charset="utf-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              background-color: #f5f5f5;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              padding: 40px;
              font-family: 'Times New Roman', 'Georgia', serif;
            }
            .certificate-wrapper {
              max-width: 800px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <div class="certificate-wrapper">
            ${printContent}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
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
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ borderRadius: '16px', overflow: 'hidden' }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 100%)', border: 'none' }}>
              <h5 className="modal-title text-white">
                <i className="bi bi-award me-2"></i>
                Certificate of Achievement
              </h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body p-0">
              {/* Certificate Content */}
              <div 
                id="certificate-content"
                style={{
                  backgroundColor: '#ffffff',
                  fontFamily: "'Times New Roman', 'Georgia', serif",
                  padding: '40px',
                  maxWidth: '800px',
                  margin: '0 auto',
                }}
              >
                {/* Gold Border Frame */}
                <div style={{
                  border: '12px double #d4af37',
                  padding: '30px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fffef7 0%, #ffffff 100%)'
                }}>
                  
                  {/* Ornamental Top */}
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '24px', color: '#d4af37' }}>✦ ✦ ✦</span>
                  </div>

                  {/* Institution Header */}
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <i className="bi bi-mortarboard-fill" style={{ fontSize: '48px', color: '#1a4731' }}></i>
                    </div>
                    <h1 style={{ 
                      color: '#1a4731', 
                      fontSize: '28px', 
                      letterSpacing: '3px',
                      margin: 0,
                      fontWeight: 'bold'
                    }}>
                      SCHOOL MANAGEMENT SYSTEM
                    </h1>
                    <p style={{ color: '#666', fontSize: '12px', marginTop: '5px' }}>
                      Excellence in Education | Accredited by Ministry of Education
                    </p>
                    <div style={{ 
                      width: '80px', 
                      height: '2px', 
                      background: '#d4af37', 
                      margin: '10px auto' 
                    }}></div>
                  </div>

                  {/* Certificate Title */}
                  <div className="text-center mb-4">
                    <h2 style={{ 
                      fontSize: '36px', 
                      fontFamily: "'Brush Script MT', cursive",
                      color: '#1a4731',
                      margin: 0
                    }}>
                      Certificate of Achievement
                    </h2>
                    <p style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
                      This certificate is proudly presented to
                    </p>
                  </div>

                  {/* Student Name - Capitalized */}
                  <div className="text-center mb-4">
                    <h2 style={{ 
                      fontSize: '32px', 
                      fontWeight: 'bold',
                      color: '#1a4731',
                      borderBottom: '2px dotted #d4af37',
                      display: 'inline-block',
                      padding: '0 20px 15px'
                    }}>
                      {formattedStudentName}
                    </h2>
                  </div>

                  {/* Achievement Description */}
                  <div className="text-center mb-4">
                    <p style={{ fontSize: '16px', marginBottom: '5px' }}>
                      for outstanding academic performance
                    </p>
                  </div>

                  {/* Academic Performance Table - GPA Highlighted */}
                  <div style={{ 
                    margin: '25px 0', 
                    background: '#f8f9fa', 
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <h4 style={{ textAlign: 'center', color: '#1a4731', marginBottom: '15px', fontSize: '16px' }}>
                      Academic Performance Summary
                    </h4>
                    
                    {/* GPA Highlight - Main Focus */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                      <div style={{ 
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 100%)',
                        padding: '15px 30px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ fontSize: '13px', color: '#fff', opacity: 0.9 }}>CUMULATIVE GPA</div>
                        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#d4af37' }}>
                          {gpa || '3.50'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#fff', opacity: 0.8 }}>Scale: 4.0</div>
                      </div>
                    </div>

                    {/* Other Stats Row */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', borderTop: '1px solid #e0e0e0', paddingTop: '15px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#0d6efd' }}>
                          {obtainedMarks || 0}/{maxMarks || 100}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Obtained Marks</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '22px', fontWeight: 'bold', color: getGradeColor() }}>
                          {percentage || 0}%
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Percentage</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '22px', 
                          fontWeight: 'bold', 
                          color: getGradeColor(),
                          background: '#fff',
                          padding: '0 15px',
                          borderRadius: '8px'
                        }}>
                          {grade || 'N/A'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#666' }}>Grade</div>
                      </div>
                    </div>
                  </div>

                  {/* Achievement Message */}
                  <div className="text-center mb-4">
                    <p style={{ 
                      fontSize: '16px', 
                      fontStyle: 'italic',
                      color: '#555',
                      borderLeft: '3px solid #d4af37',
                      borderRight: '3px solid #d4af37',
                      padding: '10px 20px',
                      display: 'inline-block'
                    }}>
                      "{message}"
                    </p>
                  </div>

                  {/* Signatures */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '30px',
                    paddingTop: '20px'
                  }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ 
                        width: '150px', 
                        borderTop: '1px solid #333',
                        margin: '0 auto',
                        marginBottom: '5px'
                      }}></div>
                      <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Principal's Signature</p>
                      <p style={{ margin: 0, fontSize: '9px', color: '#999' }}>Authorized Signatory</p>
                    </div>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ 
                        width: '150px', 
                        borderTop: '1px solid #333',
                        margin: '0 auto',
                        marginBottom: '5px'
                      }}></div>
                      <p style={{ margin: 0, fontSize: '11px', fontWeight: 'bold' }}>Registrar's Signature</p>
                      <p style={{ margin: 0, fontSize: '9px', color: '#999' }}>Official Stamp</p>
                    </div>
                  </div>

                  {/* Certificate Footer */}
                  <div className="text-center mt-4 pt-3">
                    <div style={{ 
                      width: '60px', 
                      height: '1px', 
                      background: '#d4af37', 
                      margin: '0 auto 10px' 
                    }}></div>
                    <p style={{ margin: '3px 0', fontSize: '9px', color: '#999' }}>
                      Issued on: {date || new Date().toLocaleDateString()}
                    </p>
                    <p style={{ margin: '3px 0', fontSize: '9px', color: '#999' }}>
                      Academic Year: {year || '2024/2025'}
                    </p>
                    <p style={{ margin: '3px 0', fontSize: '9px', color: '#999' }}>
                      Certificate ID: CERT-{Date.now()}
                    </p>
                    <p style={{ margin: '3px 0', fontSize: '8px', color: '#ccc' }}>
                      This is a computer-generated certificate. Verified by School Management System.
                    </p>
                  </div>

                  {/* Ornamental Bottom */}
                  <div style={{ textAlign: 'center', marginTop: '15px' }}>
                    <span style={{ fontSize: '18px', color: '#d4af37' }}>✦ ✦ ✦</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer" style={{ borderTop: '1px solid #eee' }}>
              <button className="btn btn-secondary" onClick={onClose}>
                <i className="bi bi-x-circle me-2"></i>Close
              </button>
              <button className="btn btn-primary" onClick={handlePrint} style={{ background: '#1a4731', border: 'none' }}>
                <i className="bi bi-printer me-2"></i>Print Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CertificateModal;