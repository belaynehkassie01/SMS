// pages/errors/NotFound.jsx
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center mt-5 pt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-body p-5">
          <i className="bi bi-exclamation-triangle fs-1 text-warning"></i>
          <h1 className="display-1 fw-bold text-warning">404</h1>
          <h2 className="h4 mb-3">Page Not Found</h2>
          <p className="text-muted mb-4">
            The page you are looking for does not exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house-door me-2"></i> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;