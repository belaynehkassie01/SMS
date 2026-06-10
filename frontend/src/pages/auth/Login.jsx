// pages/auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { error: notifyError, success: notifySuccess } = useNotification();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    else if (username.trim().length < 3) errors.username = 'Username must be at least 3 characters';
    if (!password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await login(username.trim(), password);
    if (result.success) {
      notifySuccess(`Welcome back, ${result.user.fullName || result.user.username}!`);
      navigate('/', { replace: true });
    } else {
      notifyError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <i className="bi bi-building fs-1 text-primary"></i>
            <h3 className="mt-2">School Management System</h3>
            <p className="text-muted">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  className={`form-control ${formErrors.username ? 'is-invalid' : ''}`}
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
              </div>
              {formErrors.username && <div className="invalid-feedback d-block">{formErrors.username}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {formErrors.password && <div className="invalid-feedback d-block">{formErrors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Logging in...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i> Login
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;