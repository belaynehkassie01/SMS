// components/dashboard/Chart.jsx
import React from 'react';

const Chart = ({ title, data, type = 'bar', height = 300 }) => {
  // This is a simple mock chart - you can integrate with Chart.js or Recharts later
  const maxValue = Math.max(...(data?.map(d => d.value) || [100]), 100);
  
  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-header bg-white border-bottom">
        <h5 className="mb-0">
          <i className="bi bi-graph-up me-2 text-primary"></i>
          {title}
        </h5>
      </div>
      <div className="card-body" style={{ height: `${height}px` }}>
        {data && data.length > 0 ? (
          <div className="d-flex align-items-end justify-content-around h-100">
            {data.map((item, index) => (
              <div key={index} className="text-center" style={{ flex: 1 }}>
                <div 
                  className="bg-primary rounded"
                  style={{ 
                    height: `${(item.value / maxValue) * 200}px`,
                    width: '40px',
                    margin: '0 auto',
                    transition: 'height 0.5s ease'
                  }}
                ></div>
                <small className="text-muted mt-2 d-block">{item.label}</small>
                <small className="fw-bold">{item.value}</small>
              </div>
            ))}
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <p className="text-muted">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chart;