// layouts/AuthLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-purple">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;