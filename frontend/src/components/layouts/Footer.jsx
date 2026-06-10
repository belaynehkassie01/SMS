// components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark border-top mt-auto py-3 bg-black">
      <div className="container-fluid px-4">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <small className="text-white">
              &copy; {currentYear} School Management System. All rights reserved.
            </small>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <small className="text-white">
              <i className="bi bi-shield-check me-1"></i> Secure Portal
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;