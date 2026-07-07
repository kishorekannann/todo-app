import React from 'react';

function TagsBreakdown({ tagCounts }) {
  if (Object.keys(tagCounts).length === 0) return null;

  return (
    <div className="tags-breakdown">
      <span className="stat-label">Tags breakdown</span>
      <div className="tags-list">
        {Object.entries(tagCounts).map(([tag, count]) => (
          <span key={tag} className="tag-stat-pill">
            {tag}: <strong>{count}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

export default TagsBreakdown;
