// pages/students/StudentForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent } from '../../services/studentService';
import { getDepartments } from '../../services/departmentService';
import { getSections } from '../../services/sectionService';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const StudentForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  // 🔐 AUTH GUARD
  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/students');
    }
  }, [user, navigate, notifyError]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    gender: '', // Will store 'M', 'F', or 'O'
    birthDate: '',
    studentNumber: '',
    departmentId: '',
    sectionId: '',
    enrollmentDate: '',
    status: 'Active',
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
  });

  const [errors, setErrors] = useState({});

  // FETCH DROPDOWNS
  const { data: deptsResponse, isLoading: loadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const { data: sectionsResponse, isLoading: loadingSections } = useQuery({
    queryKey: ['sections'],
    queryFn: getSections,
  });

  const departments = deptsResponse?.data?.data || deptsResponse?.data || [];
  const sections = sectionsResponse?.data?.data || sectionsResponse?.data || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name required';
    if (!formData.studentNumber.trim()) newErrors.studentNumber = 'Student number required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 FIXED: Map frontend field names to backend expected names
  const createMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email || null,
        Phone: data.phone || null,
        Address: data.address || null,
        Gender: data.gender || null, // Now sends 'M', 'F', or 'O'
        BirthDate: data.birthDate || null,
        StudentNumber: data.studentNumber,
        DepartmentID: data.departmentId || null,
        SectionID: data.sectionId || null,
        EnrollmentDate: data.enrollmentDate || null,
        Status: data.status || 'Active',
        GuardianName: data.guardianName || null,
        GuardianPhone: data.guardianPhone || null,
        GuardianEmail: data.guardianEmail || null,
      };
      console.log('📤 Sending payload to backend:', payload);
      return createStudent(payload);
    },
    onSuccess: () => {
      success('Student created successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
      navigate('/students');
    },
    onError: (err) => {
      console.error('❌ Create error:', err);
      console.error('Error response:', err?.response?.data);
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
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>➕ Create New Student</h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Enter student details to create a new record</p>
        </div>
        <button 
          className="btn px-4 py-2" 
          onClick={() => navigate('/students')}
          style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}
        >
          ← Back to List
        </button>
      </div>

      {/* Form Card */}
      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2" style={{ color: '#495057', borderBottom: '2px solid #e9ecef' }}>📋 Basic Information</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>
                    Student Number <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="studentNumber" 
                    className={`form-control ${errors.studentNumber ? 'is-invalid' : ''}`} 
                    value={formData.studentNumber} 
                    onChange={handleChange} 
                    placeholder="e.g., STU001" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                  {errors.studentNumber && <div className="invalid-feedback">{errors.studentNumber}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Status</label>
                  <select 
                    name="status" 
                    className="form-select" 
                    value={formData.status} 
                    onChange={handleChange} 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Enrollment Date</label>
                  <input 
                    type="date" 
                    name="enrollmentDate" 
                    className="form-control" 
                    value={formData.enrollmentDate} 
                    onChange={handleChange} 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2" style={{ color: '#495057', borderBottom: '2px solid #e9ecef' }}>👤 Personal Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>
                    First Name <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="firstName" 
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    placeholder="Enter first name" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>
                    Last Name <span className="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="lastName" 
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} 
                    value={formData.lastName} 
                    onChange={handleChange} 
                    placeholder="Enter last name" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="student@example.com" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="form-control" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="0912345678" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Address</label>
                  <textarea 
                    name="address" 
                    className="form-control" 
                    rows="2" 
                    value={formData.address} 
                    onChange={handleChange} 
                    placeholder="Enter full address" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  ></textarea>
                </div>
                
                {/* 🔥 FIXED GENDER FIELD - Uses 'M', 'F', 'O' */}
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select 
                    name="gender" 
                    className={`form-select ${errors.gender ? 'is-invalid' : ''}`} 
                    value={formData.gender} 
                    onChange={handleChange} 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>    
                    <option value="F">Female</option>   
                    <option value="O">Other</option>   
                  </select>
                  {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
                </div>
                
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Birth Date</label>
                  <input 
                    type="date" 
                    name="birthDate" 
                    className="form-control" 
                    value={formData.birthDate} 
                    onChange={handleChange} 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Department</label>
                  <select 
                    name="departmentId" 
                    className="form-select" 
                    value={formData.departmentId} 
                    onChange={handleChange} 
                    disabled={loadingDepts} 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.DeptID || d.id} value={d.DeptID || d.id}>
                        {d.DeptName || d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Section</label>
                  <select 
                    name="sectionId" 
                    className="form-select" 
                    value={formData.sectionId} 
                    onChange={handleChange} 
                    disabled={loadingSections} 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  >
                    <option value="">Select Section</option>
                    {sections.map((s) => (
                      <option key={s.SectionID || s.id} value={s.SectionID || s.id}>
                        {s.SectionName || s.name}
                      </option>
                    ))}
                  </select>
                  <small style={{ color: '#6c757d' }}>Leave empty if not assigning to a section</small>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2" style={{ color: '#495057', borderBottom: '2px solid #e9ecef' }}>👨‍👩‍👧 Guardian Information</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Guardian Name</label>
                  <input 
                    type="text" 
                    name="guardianName" 
                    className="form-control" 
                    value={formData.guardianName} 
                    onChange={handleChange} 
                    placeholder="Enter guardian full name" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Guardian Phone</label>
                  <input 
                    type="tel" 
                    name="guardianPhone" 
                    className="form-control" 
                    value={formData.guardianPhone} 
                    onChange={handleChange} 
                    placeholder="Guardian phone number" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Guardian Email</label>
                  <input 
                    type="email" 
                    name="guardianEmail" 
                    className="form-control" 
                    value={formData.guardianEmail} 
                    onChange={handleChange} 
                    placeholder="guardian@example.com" 
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }} 
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button 
                type="button" 
                className="btn px-4 py-2" 
                onClick={() => navigate('/students')} 
                disabled={isLoading} 
                style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn px-4 py-2" 
                disabled={isLoading} 
                style={{ backgroundColor: '#0d6efd', color: '#ffffff', border: 'none' }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  'Create Student'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;