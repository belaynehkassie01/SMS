// layouts/MainLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layouts/Sidebar';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarCollapsed(prev => !prev);

  return (
    <div className="d-flex vh-100 overflow-hidden">
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="d-flex flex-column flex-grow-1 overflow-hidden">
        <Header toggleSidebar={toggleSidebar} collapsed={sidebarCollapsed} />
        <main className="flex-grow-1 overflow-auto p-3 p-md-4 bg-light">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;