// layouts/BlankLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const BlankLayout = () => {
  return (
    <div className="min-vh-100 bg-white">
      <Outlet />
    </div>
  );
};

export default BlankLayout;