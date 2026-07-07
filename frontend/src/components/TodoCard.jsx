import React, { useState } from 'react';

function TodoCard({ todo, onToggle, onUpdate, onDelete, readOnly = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editTag, setEditTag] = useState(todo.tag || 'General');

  const handleStartEdit = () => {
    setEditTitle(todo.title);
    setEditTag(todo.tag || 'General');
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onUpdate(todo._id, { title: editTitle, tag: editTag.trim() || 'General' });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="todo-card">
        <div className="todo-edit-inputs">
          <input 
            type="text" 
            className="input-field" 
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            style={{ flex: 3, padding: '6px 12px' }}
            required
          />
          <input 
            type="text" 
            className="input-field" 
            value={editTag}
            onChange={e => setEditTag(e.target.value)}
            style={{ flex: 1, padding: '6px 12px' }}
            placeholder="Tag"
          />
          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleSave}>Save</button>
          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-card ${todo.completed ? 'completed' : ''}`}>
      <label className="todo-checkbox-label" style={readOnly ? { cursor: 'default' } : {}}>
        <input 
          type="checkbox" 
          className="todo-checkbox"
          checked={todo.completed}
          disabled={readOnly}
          onChange={() => !readOnly && onToggle(todo._id, todo.completed)}
        />
        <span className="todo-title">{todo.title}</span>
      </label>
      <div className="todo-meta">
        <span className="tag-badge">{todo.tag}</span>
        {!readOnly && (
          <>
            <button 
              className="btn-icon" 
              onClick={handleStartEdit}
              title="Edit Task"
            >
              ✏️
            </button>
            <button 
              className="btn-icon delete" 
              onClick={() => onDelete(todo._id)}
              title="Delete Task"
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoCard;
