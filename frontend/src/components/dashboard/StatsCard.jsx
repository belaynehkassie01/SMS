// components/dashboard/StatsCard.jsx
import React from 'react';

const StatsCard = ({ title, value, icon, color, bgColor, onClick }) => {
  return (
    <div 
      className="card h-100 shadow-sm border-0 hover-shadow"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', transition: 'transform 0.2s ease' }}
    >
      <div className="card-body d-flex align-items-center">
        <div className={`rounded-circle p-3 me-3 ${bgColor || `bg-${color}-subtle`}`}>
          <i className={`bi ${icon} fs-3 text-${color}`}></i>
        </div>
        <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h3 className="mb-0 fw-bold">{value?.toLocaleString() || 0}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;