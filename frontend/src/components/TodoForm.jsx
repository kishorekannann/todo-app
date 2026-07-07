import React from 'react';

function TodoForm({ newTodoTitle, setNewTodoTitle, newTodoTag, setNewTodoTag, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="todo-form">
      <div className="menu-section-title" style={{ marginBottom: '0' }}>Add New Task</div>
      <div className="todo-form-inputs">
        <input 
          type="text" 
          className="input-field" 
          placeholder="What needs to be done?" 
          value={newTodoTitle}
          onChange={e => setNewTodoTitle(e.target.value)}
          required
        />
        <input 
          type="text" 
          className="input-field" 
          placeholder="Tag (e.g. Urgent, Personal)" 
          value={newTodoTag}
          onChange={e => setNewTodoTag(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
        Create Task
      </button>
    </form>
  );
}

export default TodoForm;
