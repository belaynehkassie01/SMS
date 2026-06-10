// components/layout/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../context/NotificationContext';

const Header = ({ toggleSidebar, collapsed }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { success } = useNotification();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return { bg: '#dc3545', light: '#f8d7da', text: '#721c24' };
      case 'Teacher':
        return { bg: '#0d6efd', light: '#cfe2ff', text: '#084298' };
      case 'Student':
        return { bg: '#198754', light: '#d1e7dd', text: '#0a3622' };
      default:
        return { bg: '#6c757d', light: '#e9ecef', text: '#495057' };
    }
  };

  const roleStyle = getRoleBadgeColor(user?.role);

  // If not authenticated, show simple header
  if (!isAuthenticated) {
    return (
      <header className="bg-white shadow-sm px-3 py-2 d-flex justify-content-between align-items-center">
        <button
          className="btn btn-outline-secondary rounded-circle"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
          style={{ width: '40px', height: '40px' }}
        >
          <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'}`}></i>
        </button>
        <div>
          <span className="text-muted">School Management System</span>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm px-3 py-2 d-flex justify-content-between align-items-center">
      {/* Left: Sidebar Toggle Button */}
      <button
        className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
        style={{ width: '40px', height: '40px' }}
      >
        <i className={`bi ${collapsed ? 'bi-chevron-right' : 'bi-chevron-left'} fs-5`}></i>
      </button>

      {/* Right: User Dropdown */}
      <div className="position-relative" ref={dropdownRef}>
        <button
          className="btn btn-light rounded-pill d-flex align-items-center gap-2 px-3 py-1 border"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          style={{ boxShadow: 'none' }}
        >
          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
            <i className="bi bi-person fs-5 text-primary"></i>
          </div>
          <span className="fw-semibold d-none d-md-inline" style={{ color: '#2c3e50' }}>
            {user?.fullName || user?.username || 'User'}
          </span>
          <span className="badge px-2 py-1 rounded-pill d-none d-md-inline" style={{ backgroundColor: roleStyle.bg, color: 'white' }}>
            {user?.role || 'Guest'}
          </span>
          <i className={`bi bi-chevron-${dropdownOpen ? 'up' : 'down'} fs-6 text-secondary`}></i>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="position-absolute end-0 mt-2 bg-white border rounded-3 shadow-lg" style={{ minWidth: '260px', zIndex: 1050, animation: 'fadeIn 0.2s ease' }}>
            {/* User Info Header */}
            <div className="px-3 py-3 border-bottom" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-person-fill fs-3 text-primary"></i>
                </div>
                <div>
                  <div className="fw-bold text-dark">{user?.fullName || user?.username}</div>
                  <div className="small text-muted">@{user?.username}</div>
                  <span className="badge mt-1 px-2 py-1 rounded-pill" style={{ backgroundColor: roleStyle.light, color: roleStyle.text, fontSize: '10px' }}>
                    {user?.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <NavLink 
                to="/profile" 
                className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none text-dark"
                style={{ transition: 'background 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setDropdownOpen(false)}
              >
                <i className="bi bi-person fs-5 text-secondary" style={{ width: '24px' }}></i>
                <span>My Profile</span>
              </NavLink>

              <NavLink 
                to="/dashboard" 
                className="d-flex align-items-center gap-3 px-3 py-2 text-decoration-none text-dark"
                style={{ transition: 'background 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => setDropdownOpen(false)}
              >
                <i className="bi bi-speedometer2 fs-5 text-secondary" style={{ width: '24px' }}></i>
                <span>Dashboard</span>
              </NavLink>

              <hr className="dropdown-divider my-1" />

              <button 
                className="d-flex align-items-center gap-3 px-3 py-2 text-danger bg-transparent border-0 w-100 text-start"
                style={{ transition: 'background 0.2s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8d7da'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right fs-5" style={{ width: '24px' }}></i>
                <span>Logout</span>
              </button>
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-top bg-light rounded-bottom">
              <div className="small text-muted text-center">
                <i className="bi bi-shield-check me-1"></i> Secure Session
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;