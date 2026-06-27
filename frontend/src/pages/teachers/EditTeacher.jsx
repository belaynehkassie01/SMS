// pages/teachers/EditTeacher.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTeacherById, updateTeacher } from '../../services/teacherService';
import { getDepartments } from '../../services/departmentService';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const EditTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();

  React.useEffect(() => {
    if (user?.role && user.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/teachers');
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
    departmentId: '',
    hireDate: '',
    qualification: '',
    specialization: '',
    salary: '',
  });

  const [errors, setErrors] = useState({});

  // FETCH TEACHER DATA
  const { data: teacherResponse, isLoading: loadingTeacher } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => getTeacherById(id),
    enabled: !!id,
  });

  // FETCH DEPARTMENTS
  const { data: deptsResponse, isLoading: loadingDepts } = useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });

  const departments = deptsResponse?.data?.data || deptsResponse?.data || [];

  // POPULATE FORM
  useEffect(() => {
    if (teacherResponse?.data) {
      const t = teacherResponse.data;
      setFormData({
        firstName: t.FirstName || '',
        lastName: t.LastName || '',
        email: t.Email || '',
        phone: t.Phone || '',
        address: t.Address || '',
        gender: t.Gender || '',
        birthDate: t.BirthDate ? t.BirthDate.split('T')[0] : '',
        departmentId: t.DeptID || '',
        hireDate: t.HireDate ? t.HireDate.split('T')[0] : '',
        qualification: t.Qualification || '',
        specialization: t.Specialization || '',
        salary: t.Salary || '',
      });
    }
  }, [teacherResponse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'First name required';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Last name required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateMutation = useMutation({
    mutationFn: (data) => {
      const payload = {
        // Person table fields
        FirstName: data.firstName,
        LastName: data.lastName,
        Email: data.email || null,
        Phone: data.phone || null,
        Address: data.address || null,
        Gender: data.gender || null,
        BirthDate: data.birthDate || null,
        // Teacher table fields
        DeptID: data.departmentId ? parseInt(data.departmentId) : null,
        HireDate: data.hireDate || null,
        Salary: data.salary ? parseFloat(data.salary) : null,
        Qualification: data.qualification || null,
        Specialization: data.specialization || null,
      };
      console.log('📤 Sending update payload:', payload);
      return updateTeacher(id, payload);
    },
    onSuccess: () => {
      success('Teacher updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      queryClient.invalidateQueries({ queryKey: ['teacher', id] });
      navigate('/teachers');
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

  const isLoading = loadingTeacher || updateMutation.isLoading;

  if (loadingTeacher) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary ms-2">Loading teacher data...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>✏️ Edit Teacher</h2>
          <p className="mb-0 mt-1" style={{ color: '#6c757d' }}>Update teacher information in the system</p>
        </div>
        <button className="btn px-4 py-2" onClick={() => navigate('/teachers')} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #dee2e6' }}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm" style={{ backgroundColor: '#ffffff', borderRadius: '12px' }}>
        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2" style={{ color: '#495057', borderBottom: '2px solid #e9ecef' }}>👤 Personal Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>First Name <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    name="firstName" 
                    className={`form-control bg-white text-dark ${errors.firstName ? 'is-invalid' : ''}`} 
                    value={formData.firstName} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Last Name <span className="text-danger">*</span></label>
                  <input 
                    type="text" 
                    name="lastName" 
                    className={`form-control bg-white text-dark ${errors.lastName ? 'is-invalid' : ''}`} 
                    value={formData.lastName} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    className={`form-control bg-white text-dark ${errors.email ? 'is-invalid' : ''}`} 
                    value={formData.email} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Phone</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="form-control bg-white text-dark" 
                    value={formData.phone} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Address</label>
                  <textarea 
                    name="address" 
                    className="form-control bg-white text-dark" 
                    rows="2" 
                    value={formData.address} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  ></textarea>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Gender</label>
                  <select 
                    name="gender" 
                    className="form-select bg-white text-dark" 
                    value={formData.gender} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Birth Date</label>
                  <input 
                    type="date" 
                    name="birthDate" 
                    className="form-control bg-white text-dark" 
                    value={formData.birthDate} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2" style={{ color: '#495057', borderBottom: '2px solid #e9ecef' }}>👨‍🏫 Professional Information</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Department</label>
                  <select 
                    name="departmentId" 
                    className="form-select bg-white text-dark" 
                    value={formData.departmentId} 
                    onChange={handleChange} 
                    disabled={loadingDepts}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (<option key={d.DeptID || d.id} value={d.DeptID || d.id}>{d.DeptName || d.name}</option>))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Hire Date</label>
                  <input 
                    type="date" 
                    name="hireDate" 
                    className="form-control bg-white text-dark" 
                    value={formData.hireDate} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Salary (ETB)</label>
                  <input 
                    type="number" 
                    name="salary" 
                    className="form-control bg-white text-dark" 
                    value={formData.salary} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Qualification</label>
                  <input 
                    type="text" 
                    name="qualification" 
                    className="form-control bg-white text-dark" 
                    value={formData.qualification} 
                    onChange={handleChange}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-medium" style={{ color: '#212529' }}>Specialization</label>
                  <input 
                    type="text" 
                    name="specialization" 
                    className="form-control bg-white text-dark" 
                    value={formData.specialization} 
                    onChange={handleChange}
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
                onClick={() => navigate('/teachers')} 
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
                {isLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Update Teacher'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTeacher;