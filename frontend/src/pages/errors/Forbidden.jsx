// pages/errors/Forbidden.jsx
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="container text-center mt-5 pt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body p-5">
          <i className="bi bi-shield-lock fs-1 text-danger"></i>
          <h1 className="display-1 fw-bold text-danger">403</h1>
          <h2 className="h4 mb-3">Access Forbidden</h2>
          <p className="text-muted mb-4">
            You do not have permission to view this page.
            Please contact your administrator if you believe this is a mistake.
          </p>
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house-door me-2"></i> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;