import React from 'react';
import StatsGrid from '../components/StatsGrid';
import TagsBreakdown from '../components/TagsBreakdown';
import TodoCard from '../components/TodoCard';

function SharedPage({
  sharedList,
  sharedTodos,
  sharedError,
  sharedTotalCount,
  sharedCompletedCount,
  sharedPendingCount,
  sharedTagCounts
}) {
  return (
    <div className="shared-layout">
      <header className="shared-navbar">
        <div className="shared-logo">Todo Workspace</div>
        <button className="btn btn-secondary" onClick={() => window.location.href = window.location.origin}>
          Go to My App
        </button>
      </header>

      <main className="workspace-content" style={{ marginTop: '30px' }}>
        {sharedError ? (
          <div className="empty-state">
            <h3>Error loading shared list</h3>
            <p>{sharedError}</p>
          </div>
        ) : sharedList ? (
          <>
            <div className="workspace-title-group" style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              <h2>{sharedList.title}</h2>
              <span className="list-badge public">Shared Public List</span>
            </div>

            {/* Shared List Stats */}
            <StatsGrid 
              totalCount={sharedTotalCount}
              completedCount={sharedCompletedCount}
              pendingCount={sharedPendingCount}
            />

            <TagsBreakdown tagCounts={sharedTagCounts} />

            <div className="todos-container">
              {sharedTodos.length === 0 ? (
                <div className="empty-state">
                  <h3>No items</h3>
                  <p>This list is currently empty.</p>
                </div>
              ) : (
                sharedTodos.map(todo => (
                  <TodoCard 
                    key={todo._id} 
                    todo={todo} 
                    readOnly={true} 
                  />
                ))
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h3>Loading list details...</h3>
          </div>
        )}
      </main>
    </div>
  );
}

export default SharedPage;
