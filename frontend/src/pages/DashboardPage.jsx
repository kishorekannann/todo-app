import React from 'react';
import Sidebar from '../components/Sidebar';
import StatsGrid from '../components/StatsGrid';
import TagsBreakdown from '../components/TagsBreakdown';
import TodoForm from '../components/TodoForm';
import TodoCard from '../components/TodoCard';

function DashboardPage({
  user,
  lists,
  activeList,
  setActiveList,
  todos,
  selectedTag,
  setSelectedTag,
  isEditingList,
  setIsEditingList,
  editListTitle,
  setEditListTitle,
  newListName,
  setNewListName,
  newTodoTitle,
  setNewTodoTitle,
  newTodoTag,
  setNewTodoTag,
  copyFeedback,
  totalCount,
  completedCount,
  pendingCount,
  tagCounts,
  filteredTodos,
  getTagsList,
  handleCreateList,
  startRenameList,
  handleUpdateListTitle,
  handleDeleteList,
  handleToggleListPrivacy,
  handleShareList,
  copyShareLink,
  handleCreateTodo,
  handleToggleTodo,
  handleUpdateTodo,
  handleDeleteTodo,
  handleLogout
}) {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <Sidebar 
        user={user}
        lists={lists}
        activeList={activeList}
        onSelectList={(list) => { setActiveList(list); setSelectedTag('All'); }}
        onDeleteList={handleDeleteList}
        newListName={newListName}
        setNewListName={setNewListName}
        onCreateList={handleCreateList}
        onLogout={handleLogout}
      />

      {/* Main Workspace */}
      <main className="workspace">
        {activeList ? (
          <>
            {/* Workspace Header */}
            <div className="workspace-header">
              <div className="workspace-title-group" style={{ flex: 1 }}>
                {isEditingList ? (
                  <form onSubmit={handleUpdateListTitle} className="edit-list-form">
                    <input 
                      type="text" 
                      className="input-field" 
                      value={editListTitle}
                      onChange={e => setEditListTitle(e.target.value)}
                      style={{ maxWidth: '250px', padding: '6px 12px' }}
                      required
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Save</button>
                    <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setIsEditingList(false)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <h2>{activeList.title}</h2>
                    <button className="btn-icon" onClick={startRenameList} title="Rename List" style={{ padding: '2px 6px', fontSize: '0.9rem' }}>
                      ✏️
                    </button>
                  </>
                )}
                <span className={`list-badge ${activeList.isPublic ? 'public' : 'private'}`}>
                  {activeList.isPublic ? '🌐 Public Shared' : '🔒 Private List'}
                </span>
              </div>
              <div className="workspace-header-actions">
                <button className="btn btn-secondary" onClick={handleToggleListPrivacy}>
                  Make {activeList.isPublic ? 'Private' : 'Public'}
                </button>
                {activeList.isPublic && (
                  <button className="btn btn-primary" onClick={activeList.shareToken ? copyShareLink : handleShareList}>
                    {activeList.shareToken ? (copyFeedback ? 'Copied!' : 'Copy Share Link') : 'Enable Sharing'}
                  </button>
                )}
              </div>
            </div>

            {/* Public Share Link Area */}
            {activeList.isPublic && activeList.shareToken && (
              <div className="share-banner">
                <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>Public Read-Only Link:</span>
                <span className="share-link-text">
                  {`${window.location.origin}${window.location.pathname}?share=${activeList.shareToken}`}
                </span>
                <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={copyShareLink}>
                  {copyFeedback ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            )}

            {/* Workspace Main Panel */}
            <div className="workspace-content">
              
              {/* Statistics Grid */}
              <StatsGrid 
                totalCount={totalCount}
                completedCount={completedCount}
                pendingCount={pendingCount}
              />

              {/* Tags Breakdown */}
              <TagsBreakdown tagCounts={tagCounts} />

              {/* Form to add Todo */}
              <TodoForm 
                newTodoTitle={newTodoTitle}
                setNewTodoTitle={setNewTodoTitle}
                newTodoTag={newTodoTag}
                setNewTodoTag={setNewTodoTag}
                onSubmit={handleCreateTodo}
              />

              {/* Tag Filters */}
              {getTagsList().length > 1 && (
                <div className="filters-bar">
                  <span className="filter-label">Filter by tag:</span>
                  {getTagsList().map(tag => (
                    <button 
                      key={tag}
                      className={`filter-chip ${selectedTag === tag ? 'active' : ''}`}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Todos List */}
              <div className="todos-container">
                {filteredTodos.length === 0 ? (
                  <div className="empty-state">
                    <h3>No items found</h3>
                    <p>{todos.length === 0 ? 'Start by adding a task above.' : 'Try changing your tag filter.'}</p>
                  </div>
                ) : (
                  filteredTodos.map(todo => (
                    <TodoCard 
                      key={todo._id} 
                      todo={todo} 
                      onToggle={handleToggleTodo}
                      onUpdate={handleUpdateTodo}
                      onDelete={handleDeleteTodo}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state" style={{ margin: 'auto' }}>
            <h3>No List Selected</h3>
            <p>Select a list from the sidebar or create a new one to begin.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default DashboardPage;
