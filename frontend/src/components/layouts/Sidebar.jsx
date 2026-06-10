// components/layout/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, isAdmin, isTeacher, isStudent } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2', end: true },
    ];
    const adminItems = [
      { path: '/users', label: 'Users', icon: 'bi-people' },
      { path: '/students', label: 'Students', icon: 'bi-people-fill' },
      { path: '/teachers', label: 'Teachers', icon: 'bi-person-badge' },
      { path: '/teaches', label: 'Teacher Assignments', icon: 'bi-link' },
      { path: '/courses', label: 'Courses', icon: 'bi-book' },
      { path: '/sections', label: 'Sections', icon: 'bi-grid-3x3-gap-fill' },
      { path: '/enrollments', label: 'Enrollments', icon: 'bi-journal-check' },
      { path: '/departments', label: 'Departments', icon: 'bi-building' },
      { path: '/academic-years', label: 'Academic Years', icon: 'bi-calendar-event' },
      { path: '/exams', label: 'Exams', icon: 'bi-file-text' },
      { path: '/results', label: 'Results', icon: 'bi-trophy' },
      { path: '/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
      { path: '/payments', label: 'Payments', icon: 'bi-credit-card' },
      { path: '/reports', label: 'Reports', icon: 'bi-bar-chart' },  // ✅ Added Reports for Admin
    ];
    const teacherItems = [
      { path: '/sections', label: 'My Sections', icon: 'bi-chalkboard' },
      { path: '/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
      { path: '/exams', label: 'Exams', icon: 'bi-file-text' },
      { path: '/results', label: 'Results', icon: 'bi-trophy' },
      { path: '/teaches', label: 'Teacher Assignments', icon: 'bi-link' },
      { path: '/reports', label: 'Reports', icon: 'bi-bar-chart' },  // ✅ Added Reports for Teacher
    ];
    const studentItems = [
      { path: '/courses', label: 'My Courses', icon: 'bi-book-half' },
      { path: '/attendance', label: 'Attendance', icon: 'bi-calendar-check' },
      { path: '/results', label: 'Results', icon: 'bi-bar-chart-steps' },
      { path: '/reports', label: 'My Reports', icon: 'bi-bar-chart' },  // ✅ Added Reports for Student
    ];
 
    let items = [...commonItems];
    if (isAdmin) items.push(...adminItems);
    if (isTeacher) items.push(...teacherItems);
    if (isStudent) items.push(...studentItems);
    return items;
  };

  const menuItems = getMenuItems();

  const sidebarClasses = `sidebar bg-dark text-white d-flex flex-column flex-shrink-0 ${isMobile ? 'mobile-sidebar' : ''} ${mobileOpen ? 'mobile-open' : ''} ${collapsed && !isMobile ? 'sidebar-collapsed' : ''}`;
  const sidebarStyle = isMobile
    ? { width: '260px', transition: 'transform 0.3s ease' }
    : { width: collapsed ? '70px' : '260px', transition: 'width 0.2s ease', overflowX: 'hidden' };

  return (
    <>
      {isMobile && mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)}></div>
      )}
      <div className={sidebarClasses} style={sidebarStyle}>
        {/* Logo */}
        <div className="d-flex align-items-center justify-content-center p-3 border-bottom border-secondary">
          {(!collapsed || isMobile) ? (
            <h5 className="mb-0 text-white">SMS Portal</h5>
          ) : (
            <i className="bi bi-mortarboard fs-4 text-white"></i>
          )}
          {isMobile && (
            <button className="btn-close btn-close-white position-absolute end-0 me-3" onClick={() => setMobileOpen(false)}></button>
          )}
        </div>

        {/* Navigation */}
        <nav className="nav flex-column mt-3 flex-grow-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `sidebar-link nav-link text-white d-flex align-items-center px-3 py-2 ${isActive ? 'active' : ''}`
              }
              onClick={() => isMobile && setMobileOpen(false)}
            >
              <i className={`bi ${item.icon}`} style={{ fontSize: '1.2rem', minWidth: '24px', textAlign: 'center' }}></i>
              {(!collapsed || isMobile) && <span className="ms-2">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="mt-auto p-3 border-top border-secondary">
          {(!collapsed || isMobile) ? (
            <div className="small text-truncate">
              <i className="bi bi-person-circle me-2"></i>
              {user?.fullName || user?.username}
              <br />
              <span className="text-secondary">{user?.role}</span>
            </div>
          ) : (
            <i className="bi bi-person-circle d-block text-center fs-4"></i>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;