// pages/users/CreateUser.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../../services/userService';
import { getPersonsWithoutAccount, getRoles } from '../../services/userService';
import { createPerson } from '../../services/personService';
import { useQuery } from '@tanstack/react-query';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';

const CreateUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { success, error: notifyError } = useNotification();
  const selectRef = useRef(null);

  React.useEffect(() => {
    if (user?.role !== 'Admin') {
      notifyError('Access denied. Admin only.');
      navigate('/users');
    }
  }, [user, navigate, notifyError]);

  // Person mode: 'select' or 'create'
  const [personMode, setPersonMode] = useState('select');
  
  // Search filter for person dropdown
  const [personSearch, setPersonSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    // For select mode
    selectedPersonId: '',
    // For create mode
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    birthDate: '',
    // Account fields (common)
    username: '',
    password: '',
    confirmPassword: '',
    roleId: '',
    isActive: true,
  });

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch persons without accounts (for select mode)
  const { data: personsResponse, isLoading: loadingPersons, error: personsError } = useQuery({
    queryKey: ['personsWithoutAccount'],
    queryFn: getPersonsWithoutAccount,
    enabled: personMode === 'select',
  });

  // Fetch roles
  const { data: rolesResponse, isLoading: loadingRoles } = useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  });

  // Extract persons array
  let persons = [];
  if (personsResponse?.data && Array.isArray(personsResponse.data)) {
    persons = personsResponse.data;
  } else if (personsResponse?.data?.data && Array.isArray(personsResponse.data.data)) {
    persons = personsResponse.data.data;
  }

  // Filter persons by search (ID or Name)
  const filteredPersons = persons.filter(p => {
    if (!personSearch) return true;
    const searchLower = personSearch.toLowerCase();
    return (
      p.PersonID?.toString().includes(searchLower) ||
      p.FirstName?.toLowerCase().includes(searchLower) ||
      p.LastName?.toLowerCase().includes(searchLower) ||
      `${p.FirstName} ${p.LastName}`.toLowerCase().includes(searchLower) ||
      p.Email?.toLowerCase().includes(searchLower)
    );
  });

  // Auto-open dropdown when typing in search
  useEffect(() => {
    if (personMode === 'select' && personSearch && selectRef.current) {
      // Open the dropdown by setting size to show options
      setIsDropdownOpen(true);
      if (selectRef.current) {
        selectRef.current.size = Math.min(filteredPersons.length + 1, 6);
      }
    }
  }, [personSearch, personMode, filteredPersons.length]);

  // Extract roles array
  let roles = [];
  if (rolesResponse?.data && Array.isArray(rolesResponse.data)) {
    roles = rolesResponse.data;
  } else if (rolesResponse?.data?.data && Array.isArray(rolesResponse.data.data)) {
    roles = rolesResponse.data.data;
  }

  // Handle person selection - auto-fill person info
  const handlePersonSelect = (e) => {
    const personId = e.target.value;
    setFormData(prev => ({ ...prev, selectedPersonId: personId }));
    
    const person = persons.find(p => p.PersonID === parseInt(personId));
    setSelectedPerson(person);
    // Close dropdown after selection
    setIsDropdownOpen(false);
    if (selectRef.current) {
      selectRef.current.size = 1;
    }
    // Clear search
    setPersonSearch('');
  };

  // Open dropdown on click
  const handleDropdownClick = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
      if (selectRef.current) {
        selectRef.current.size = Math.min(filteredPersons.length + 1, 6);
      }
    } else {
      setIsDropdownOpen(false);
      if (selectRef.current) {
        selectRef.current.size = 1;
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        if (selectRef.current) {
          selectRef.current.size = 1;
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setPersonSearch(e.target.value);
    // Clear selection when search changes
    if (formData.selectedPersonId) {
      setFormData(prev => ({ ...prev, selectedPersonId: '' }));
      setSelectedPerson(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Account validation (common for both modes)
    if (!formData.username?.trim()) newErrors.username = 'Username is required';
    if (formData.username && formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.roleId) newErrors.roleId = 'Role is required';

    // Person validation based on mode
    if (personMode === 'select') {
      if (!formData.selectedPersonId) newErrors.selectedPersonId = 'Please select a person';
    } else {
      if (!formData.firstName?.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName?.trim()) newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMutation = useMutation({
    mutationFn: async (data) => {
      let personId;

      if (personMode === 'select') {
        // Use existing person
        if (!data.selectedPersonId) {
          throw new Error('Please select a person');
        }
        personId = parseInt(data.selectedPersonId);
        console.log('Using existing person ID:', personId);
      } else {
        // Create new person first
        const personPayload = {
          FirstName: data.firstName,
          LastName: data.lastName,
          Email: data.email || null,
          Phone: data.phone || null,
          Address: data.address || null,
          Gender: data.gender || null,
          BirthDate: data.birthDate || null,
        };
        
        console.log('Creating person with payload:', personPayload);
        
        try {
          const personResponse = await createPerson(personPayload);
          console.log('Person creation response:', personResponse);
          
          personId = personResponse?.data?.data?.PersonID || 
                     personResponse?.data?.PersonID || 
                     personResponse?.PersonID;
          
          if (!personId) {
            console.error('Failed to extract PersonID from response:', personResponse);
            throw new Error('Failed to create person - no PersonID returned');
          }
          
          console.log('Created new person with ID:', personId);
        } catch (personError) {
          console.error('Person creation error:', personError);
          throw new Error(personError?.response?.data?.message || 'Failed to create person');
        }
      }

      // Create user account
      const userPayload = {
        Username: data.username,
        Password: data.password,
        PersonID: personId,
        RoleID: parseInt(data.roleId),
        IsActive: data.isActive ? 1 : 0,
      };
      
      console.log('Creating user account with payload:', userPayload);
      
      const userResponse = await createUser(userPayload);
      console.log('User creation response:', userResponse);
      
      return userResponse;
    },
    onSuccess: () => {
      success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['personsWithoutAccount'] });
      navigate('/users');
    },
    onError: (err) => {
      console.error('Create error:', err);
      notifyError(err?.response?.data?.message || err?.message || 'Create failed');
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-semibold" style={{ color: '#1a1a2e' }}>
            <i className="bi bi-person-plus me-2 text-primary"></i>
            CREATE NEW USER
          </h2>
          <p className="text-secondary mb-0">Create a system user account</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/users')}>
          ← Back to List
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body bg-white p-4">
          <form onSubmit={handleSubmit}>
            {/* PERSON INFORMATION SECTION */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2 border-bottom">
                <i className="bi bi-person-badge me-2 text-primary"></i>
                SELECT OR CREATE PERSON
              </h5>

              {/* Mode Selection */}
              <div className="mb-3">
                <div className="form-check mb-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="modeSelect"
                    name="personMode"
                    checked={personMode === 'select'}
                    onChange={() => {
                      setPersonMode('select');
                      setSelectedPerson(null);
                      setFormData(prev => ({ ...prev, selectedPersonId: '' }));
                      setPersonSearch('');
                      setIsDropdownOpen(false);
                      if (selectRef.current) selectRef.current.size = 1;
                    }}
                  />
                  <label className="form-check-label fw-semibold text-dark" htmlFor="modeSelect">
                    Select Existing Person
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="modeCreate"
                    name="personMode"
                    checked={personMode === 'create'}
                    onChange={() => {
                      setPersonMode('create');
                      setSelectedPerson(null);
                    }}
                  />
                  <label className="form-check-label fw-semibold text-dark" htmlFor="modeCreate">
                    Create New Person
                  </label>
                </div>
              </div>

              {/* Select Existing Person */}
              {personMode === 'select' && (
                <div className="mt-3">
                  <label className="form-label fw-semibold text-dark">
                    Select Person <span className="text-danger">*</span>
                  </label>
                  
                  {/* Search Input - when typed, automatically opens dropdown */}
                  <div className="mb-2">
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-search text-secondary"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type ID, Name, or Email to search and open dropdown..."
                        value={personSearch}
                        onChange={handleSearchChange}
                        style={{ backgroundColor: '#ffffff', color: '#212529' }}
                      />
                      {personSearch && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setPersonSearch('');
                            setFormData(prev => ({ ...prev, selectedPersonId: '' }));
                            setSelectedPerson(null);
                          }}
                        >
                          <i className="bi bi-x-circle"></i>
                        </button>
                      )}
                    </div>
                    <div className="mt-1">
                      <small className="text-primary">
                        <i className="bi bi-info-circle me-1"></i>
                        {filteredPersons.length} person(s) available
                      </small>
                    </div>
                  </div>

                  {loadingPersons ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span className="ms-2 text-primary">Loading persons...</span>
                    </div>
                  ) : personsError ? (
                    <div className="alert alert-danger py-2">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Failed to load persons. Please refresh the page.
                    </div>
                  ) : filteredPersons.length === 0 ? (
                    <div className="alert alert-info py-2">
                      <i className="bi bi-info-circle me-2"></i>
                      No persons found. Try a different search or create a new person.
                    </div>
                  ) : (
                    <select
                      ref={selectRef}
                      name="selectedPersonId"
                      className={`form-select bg-white text-dark ${errors.selectedPersonId ? 'is-invalid' : ''}`}
                      value={formData.selectedPersonId}
                      onChange={handlePersonSelect}
                      onClick={handleDropdownClick}
                      size={isDropdownOpen ? Math.min(filteredPersons.length + 1, 6) : 1}
                      style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                    >
                      <option value="">Select a person </option>
                      {filteredPersons.map((p) => (
                        <option key={p.PersonID} value={p.PersonID}>
                          🆔 ID: {p.PersonID} - 👤 {p.FirstName} {p.LastName} - 📧 {p.Email || 'No email'}
                        </option>
                      ))}
                    </select>
                  )}
                  {errors.selectedPersonId && <div className="invalid-feedback d-block">{errors.selectedPersonId}</div>}
                  
                  {/* Auto-filled Person Info */}
                  {selectedPerson && (
                    <div className="mt-3 p-3 bg-light rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="bi bi-person-check text-primary"></i>
                        <strong className="text-dark">Selected Person Details:</strong>
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <small className="text-primary d-block">Full Name</small>
                          <span className="fw-semibold" style={{ color: '#212529' }}>{selectedPerson.FirstName} {selectedPerson.LastName}</span>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-primary d-block">Person ID</small>
                          <span style={{ color: '#212529' }}>{selectedPerson.PersonID}</span>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-primary d-block">Email</small>
                          <span style={{ color: '#212529' }}>{selectedPerson.Email || '-'}</span>
                        </div>
                        <div className="col-md-6 mb-2">
                          <small className="text-primary d-block">Phone</small>
                          <span style={{ color: '#212529' }}>{selectedPerson.Phone || '-'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Create New Person Form */}
              {personMode === 'create' && (
                <div className="row g-3 mt-2">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className={`form-control bg-white text-dark ${errors.firstName ? 'is-invalid' : ''}`}
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className={`form-control bg-white text-dark ${errors.lastName ? 'is-invalid' : ''}`}
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control bg-white text-dark"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control bg-white text-dark"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold text-dark">Address</label>
                    <textarea
                      name="address"
                      className="form-control bg-white text-dark"
                      rows="2"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter address (optional)"
                      style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Gender</label>
                    <select
                      name="gender"
                      className="form-select bg-white text-dark"
                      value={formData.gender}
                      onChange={handleChange}
                      style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-dark">Birth Date</label>
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
              )}
            </div>

            {/* ACCOUNT INFORMATION SECTION */}
            <div className="mb-4">
              <h5 className="mb-3 pb-2 border-bottom">
                <i className="bi bi-key me-2 text-primary"></i>
                ACCOUNT INFORMATION
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Username <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    className={`form-control bg-white text-dark ${errors.username ? 'is-invalid' : ''}`}
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Role <span className="text-danger">*</span>
                  </label>
                  <select
                    name="roleId"
                    className={`form-select bg-white text-dark ${errors.roleId ? 'is-invalid' : ''}`}
                    value={formData.roleId}
                    onChange={handleChange}
                    disabled={loadingRoles}
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.RoleID} value={r.RoleID}>
                        {r.RoleName}
                      </option>
                    ))}
                  </select>
                  {errors.roleId && <div className="invalid-feedback">{errors.roleId}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control bg-white text-dark ${errors.password ? 'is-invalid' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    Confirm Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control bg-white text-dark ${errors.confirmPassword ? 'is-invalid' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    style={{ backgroundColor: '#ffffff', color: '#212529', border: '1px solid #ced4da' }}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                </div>

                <div className="col-md-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      name="isActive"
                      className="form-check-input"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      id="isActive"
                    />
                    <label className="form-check-label text-dark" htmlFor="isActive">
                      Active Account
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/users')}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;