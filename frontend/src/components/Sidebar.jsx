import React from 'react';

function Sidebar({ 
  user, 
  lists, 
  activeList, 
  onSelectList, 
  onDeleteList, 
  newListName, 
  setNewListName, 
  onCreateList, 
  onLogout 
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">Todo Workspace</div>
      </div>

      {user && (
        <div className="sidebar-profile">
          <div className="profile-info">
            <span className="profile-name">{user.name}</span>
            <span className="profile-email">{user.email}</span>
          </div>
          <button className="btn-icon" onClick={onLogout} title="Log Out">
            🚪
          </button>
        </div>
      )}

      <div className="sidebar-menu">
        <div>
          <div className="menu-section-title">New List</div>
          <form onSubmit={onCreateList} className="flex gap-10">
            <input 
              type="text" 
              className="input-field" 
              placeholder="List Name..." 
              value={newListName}
              onChange={e => setNewListName(e.target.value)}
              style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              required
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 14px' }}>
              +
            </button>
          </form>
        </div>

        <div>
          <div className="menu-section-title">Your Lists</div>
          <div className="lists-container">
            {lists.length === 0 ? (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-dark)', padding: '10px 0' }}>
                No lists created.
              </div>
            ) : (
              lists.map(list => (
                <div 
                  key={list._id} 
                  className={`list-menu-item ${activeList?._id === list._id ? 'active' : ''}`}
                  onClick={() => onSelectList(list)}
                >
                  <span className="list-menu-title">{list.title}</span>
                  <div className="list-menu-actions">
                    <button 
                      className="btn-icon delete" 
                      onClick={(e) => onDeleteList(list._id, e)} 
                      title="Delete List"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
