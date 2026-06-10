// components/dashboard/RecentActivity.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const RecentActivity = ({ activities, title = "Recent Activities", viewAllLink = null }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'student':
        return <i className="bi bi-person-plus-fill text-primary"></i>;
      case 'payment':
        return <i className="bi bi-credit-card text-success"></i>;
      case 'enrollment':
        return <i className="bi bi-journal-check text-info"></i>;
      case 'result':
        return <i className="bi bi-trophy text-warning"></i>;
      default:
        return <i className="bi bi-bell text-secondary"></i>;
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <i className="bi bi-clock-history me-2 text-primary"></i>
          {title}
        </h5>
        {viewAllLink && (
          <Link to={viewAllLink} className="btn btn-sm btn-link text-decoration-none">
            View All <i className="bi bi-chevron-right"></i>
          </Link>
        )}
      </div>
      <div className="card-body p-0">
        {activities && activities.length > 0 ? (
          <div className="list-group list-group-flush">
            {activities.slice(0, 5).map((activity, index) => (
              <div key={index} className="list-group-item d-flex align-items-center gap-3">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-grow-1">
                  <p className="mb-0 fw-semibold">{activity.description}</p>
                  <small className="text-muted">{activity.timestamp}</small>
                </div>
                {activity.link && (
                  <Link to={activity.link} className="btn btn-sm btn-outline-primary">
                    View
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-inbox fs-1 text-muted"></i>
            <p className="text-muted mt-2">No recent activities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;