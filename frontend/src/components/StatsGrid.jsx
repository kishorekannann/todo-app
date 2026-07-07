import React from 'react';

function StatsGrid({ totalCount, completedCount, pendingCount }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <span className="stat-label">Total Tasks</span>
        <span className="stat-value">{totalCount}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Completed</span>
        <span className="stat-value success">{completedCount}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Pending</span>
        <span className="stat-value warning">{pendingCount}</span>
      </div>
    </div>
  );
}

export default StatsGrid;
