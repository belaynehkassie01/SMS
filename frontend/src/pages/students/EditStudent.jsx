// pages/students/EditStudent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentById, updateStudent } from '../../services/studentService';
import { getDepartments } from '../../services/departmentService';
import { getSections } from '../../services/sectionService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

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
    gender: '',
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

  // FETCH STUDENT DATA
  const { data: studentResponse, isLoading: loadingStudent } = useQuery({
    queryKey: ['student', id],
    queryFn: () => getStudentById(id),
    enabled: !!id,
  });

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

  // POPULATE FORM
  useEffect(() => {
    if (studentResponse?.data) {
      const s = studentResponse.data;
      setFormData({
        firstName: s.FirstName || '',
        lastName: s.LastName || '',
        email: s.Email || '',
        phone: s.Phone || '',
        address: s.Address || '',
        gender: s.Gender || '',
        birthDate: s.BirthDate ? s.BirthDate.split('T')[0] : '',
        studentNumber: s.StudentNumber || '',
        departmentId: s.DepartmentID || '',
        sectionId: s.SectionID || '',
        enrollmentDate: s.EnrollmentDate ? s.EnrollmentDate.split('T')[0] : '',
        status: s.Status || 'Active',
        guardianName: s.GuardianName || '',
        guardianPhone: s.GuardianPhone || '',
        guardianEmail: s.GuardianEmail || '',
      });
    }
  }, [studentResponse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name required';
    if (!formData.studentNumber?.trim()) newErrors.studentNumber = 'Student number required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // UPDATE MUTATION
  const updateMutation = useMutation({
    mutationFn: (data) => {
      // Ensure all required fields are sent with proper names
      const payload = {
        StudentNumber: data.studentNumber,
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email || null,
        Phone: data.phone || null,
        Address: data.address || null,
        Gender: data.gender || null,
        BirthDate: data.birthDate || null,
        DepartmentID: data.departmentId ? parseInt(data.departmentId) : null,
        SectionID: data.sectionId ? parseInt(data.sectionId) : null,
        EnrollmentDate: data.enrollmentDate || null,
        Status: data.status,
        GuardianName: data.guardianName || null,
        GuardianPhone: data.guardianPhone || null,
        GuardianEmail: data.guardianEmail || null,
      };
      console.log('Sending update payload:', JSON.stringify(payload, null, 2));
      return updateStudent(id, payload);
    },
    onSuccess: () => {
      success('Student updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', id] });
      navigate('/students');
    },
    onError: (err) => {
      console.error('Update error:', err);
      console.error('Error response data:', err?.response?.data);
      const errorMsg = err?.response?.data?.message || err?.response?.data?.errors?.[0]?.msg || 'Update failed';
      notifyError(errorMsg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    updateMutation.mutate(formData);
  };

  const isLoading = loadingStudent || updateMutation.isLoading;

  if (loadingStudent) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>✏️ Edit Student</h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Update student information in the system</p>
        </div>
        <button className="btn px-4 py-2" onClick={() => navigate('/students')} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2" style={{ color: '#495057', borderBottom: '2px solid #e9ecef' }}>📋 Basic Information</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Student Number <span className="text-danger">*</span></label>
                  <input type="text" name="studentNumber" className={`form-control ${errors.studentNumber ? 'is-invalid' : ''}`} value={formData.studentNumber} onChange={handleChange} />
                  {errors.studentNumber && <div className="invalid-feedback">{errors.studentNumber}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Status</label>
                  <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Enrollment Date</label>
                  <input type="date" name="enrollmentDate" className="form-control" value={formData.enrollmentDate} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2" style={{ color: '#495057', borderBottom: '2px solid #e9ecef' }}>👤 Personal Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>First Name <span className="text-danger">*</span></label>
                  <input type="text" name="firstName" className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} value={formData.firstName} onChange={handleChange} />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Last Name <span className="text-danger">*</span></label>
                  <input type="text" name="lastName" className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} value={formData.lastName} onChange={handleChange} />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Phone</label>
                  <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Address</label>
                  <textarea name="address" className="form-control" rows="2" value={formData.address} onChange={handleChange}></textarea>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Gender</label>
                  <select name="gender" className="form-select" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Birth Date</label>
                  <input type="date" name="birthDate" className="form-control" value={formData.birthDate} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Department</label>
                  <select name="departmentId" className="form-select" value={formData.departmentId} onChange={handleChange} disabled={loadingDepts}>
                    <option value="">Select Department</option>
                    {departments.map((d) => (<option key={d.DeptID || d.id} value={d.DeptID || d.id}>{d.DeptName || d.name}</option>))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Section</label>
                  <select name="sectionId" className="form-select" value={formData.sectionId} onChange={handleChange} disabled={loadingSections}>
                    <option value="">Select Section</option>
                    {sections.map((s) => (<option key={s.SectionID || s.id} value={s.SectionID || s.id}>{s.SectionName || s.name}</option>))}
                  </select>
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2" style={{ color: '#495057', borderBottom: '2px solid #e9ecef' }}>👨‍👩‍👧 Guardian Information</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Guardian Name</label>
                  <input type="text" name="guardianName" className="form-control" value={formData.guardianName} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Guardian Phone</label>
                  <input type="tel" name="guardianPhone" className="form-control" value={formData.guardianPhone} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Guardian Email</label>
                  <input type="email" name="guardianEmail" className="form-control" value={formData.guardianEmail} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 d-flex justify-content-end gap-2">
              <button type="button" className="btn px-4 py-2" onClick={() => navigate('/students')} disabled={isLoading} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}>Cancel</button>
              <button type="submit" className="btn px-4 py-2" disabled={isLoading} style={{ backgroundColor: '#0d6efd', color: '#ffffff', border: 'none' }}>
                {isLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Update Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;