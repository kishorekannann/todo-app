import { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SharedPage from './pages/SharedPage';

const BASE_URL = 'http://localhost:5000/api';

function App() {
  // Navigation & Auth State
  const [currentView, setCurrentView] = useState('auth');
  const [authTab, setAuthTab] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  // Auth Form Fields
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard Data State
  const [lists, setLists] = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [todos, setTodos] = useState([]);
  const [selectedTag, setSelectedTag] = useState('All');

  // Inline List Edit State
  const [isEditingList, setIsEditingList] = useState(false);
  const [editListTitle, setEditListTitle] = useState('');

  // Creation Fields
  const [newListName, setNewListName] = useState('');
  const [newListIsPublic, setNewListIsPublic] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoTag, setNewTodoTag] = useState('');

  // Share link copy feedback
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Shared View State
  const [sharedList, setSharedList] = useState(null);
  const [sharedTodos, setSharedTodos] = useState([]);
  const [sharedError, setSharedError] = useState('');

  // 1. Initial Route Check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareToken = params.get('share');

    if (shareToken) {
      setCurrentView('shared');
      loadSharedList(shareToken);
    } else {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setCurrentView('dashboard');
      } else {
        setCurrentView('auth');
      }
    }
  }, []);

  // 2. Fetch lists when token changes (or user logs in)
  useEffect(() => {
    if (token && currentView === 'dashboard') {
      fetchLists();
    }
  }, [token, currentView]);

  // 3. Fetch todos when active list changes
  useEffect(() => {
    if (activeList) {
      fetchTodos(activeList._id);
      setIsEditingList(false);
    } else {
      setTodos([]);
    }
  }, [activeList]);

  // API Call Helpers
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  const fetchLists = async () => {
    try {
      const res = await fetch(`${BASE_URL}/lists`, {
        headers: getAuthHeaders()
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to fetch lists');
      const data = await res.json();
      setLists(data);
      if (data.length > 0 && !activeList) {
        setActiveList(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodos = async (listId) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/list/${listId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch todos');
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Auth Operations
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = authTab === 'login' ? 'login' : 'register';
    const payload = authTab === 'login'
      ? { email: authEmail, password: authPassword }
      : { name: authName, email: authEmail, password: authPassword };

    try {
      const res = await fetch(`${BASE_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, _id: data._id }));
      setToken(data.token);
      setUser({ name: data.name, email: data.email, _id: data._id });
      setCurrentView('dashboard');

      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setLists([]);
    setActiveList(null);
    setTodos([]);
    setCurrentView('auth');
  };

  // List Operations
  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      const res = await fetch(`${BASE_URL}/lists`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: newListName, isPublic: newListIsPublic })
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to create list');
      const data = await res.json();
      setLists([data, ...lists]);
      setActiveList(data);
      setNewListName('');
    } catch (err) {
      console.error(err);
    }
  };

  const startRenameList = () => {
    if (!activeList) return;
    setEditListTitle(activeList.title);
    setIsEditingList(true);
  };

  const handleUpdateListTitle = async (e) => {
    e.preventDefault();
    if (!editListTitle.trim() || !activeList) return;
    try {
      const res = await fetch(`${BASE_URL}/lists/${activeList._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: editListTitle })
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to update list');
      const data = await res.json();
      setLists(lists.map(l => l._id === activeList._id ? data : l));
      setActiveList(data);
      setIsEditingList(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteList = async (listId, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this list and all its todos?')) return;
    try {
      const res = await fetch(`${BASE_URL}/lists/${listId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to delete list');

      const remainingLists = lists.filter(l => l._id !== listId);
      setLists(remainingLists);
      if (activeList?._id === listId) {
        setActiveList(remainingLists.length > 0 ? remainingLists[0] : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleListPrivacy = async () => {
    if (!activeList) return;
    const updatedPrivacy = !activeList.isPublic;
    try {
      const res = await fetch(`${BASE_URL}/lists/${activeList._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isPublic: updatedPrivacy })
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to update list privacy');
      const data = await res.json();

      setLists(lists.map(l => l._id === activeList._id ? data : l));
      setActiveList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShareList = async () => {
    if (!activeList) return;
    try {
      const res = await fetch(`${BASE_URL}/lists/${activeList._id}/share`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to generate share token');
      const data = await res.json();

      const updatedList = { ...activeList, shareToken: data.shareToken };
      setLists(lists.map(l => l._id === activeList._id ? updatedList : l));
      setActiveList(updatedList);
    } catch (err) {
      console.error(err);
    }
  };

  const copyShareLink = () => {
    if (!activeList?.shareToken) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${activeList.shareToken}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  // Todo Operations
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !activeList) return;
    try {
      const res = await fetch(`${BASE_URL}/todos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newTodoTitle,
          tag: newTodoTag.trim() || 'General',
          list: activeList._id
        })
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to create todo');
      const data = await res.json();
      setTodos([...todos, data]);
      setNewTodoTitle('');
      setNewTodoTag('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTodo = async (todoId, currentCompleted) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/${todoId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed: !currentCompleted })
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to update todo');
      const data = await res.json();
      setTodos(todos.map(t => t._id === todoId ? data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTodo = async (todoId, updatedFields) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/${todoId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedFields)
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to update todo');
      const data = await res.json();
      setTodos(todos.map(t => t._id === todoId ? data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const res = await fetch(`${BASE_URL}/todos/${todoId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.status === 401) return handleLogout();
      if (!res.ok) throw new Error('Failed to delete todo');
      setTodos(todos.filter(t => t._id !== todoId));
    } catch (err) {
      console.error(err);
    }
  };

  // Shared View Fetch
  const loadSharedList = async (shareToken) => {
    try {
      const listRes = await fetch(`${BASE_URL}/lists/shared/${shareToken}`);
      if (!listRes.ok) throw new Error('Shared list not found or no longer available');
      const listData = await listRes.json();
      setSharedList(listData);

      const todosRes = await fetch(`${BASE_URL}/todos/list/${listData._id}`);
      if (!todosRes.ok) throw new Error('Failed to fetch shared list items');
      const todosData = await todosRes.json();
      setSharedTodos(todosData);
    } catch (err) {
      setSharedError(err.message);
    }
  };


  const totalCount = todos.length;
  const completedCount = todos.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;

  const tagCounts = {};
  todos.forEach(t => {
    let tag = t.tag ? t.tag.trim() : 'General';
    if (!tag || tag.toLowerCase() === 'general') {
      tag = 'no tag';
    }
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });

  const sharedTotalCount = sharedTodos.length;
  const sharedCompletedCount = sharedTodos.filter(t => t.completed).length;
  const sharedPendingCount = sharedTotalCount - sharedCompletedCount;

  const sharedTagCounts = {};
  sharedTodos.forEach(t => {
    let tag = t.tag ? t.tag.trim() : 'General';
    if (!tag || tag.toLowerCase() === 'general') {
      tag = 'no tag';
    }
    sharedTagCounts[tag] = (sharedTagCounts[tag] || 0) + 1;
  });

  // Filter tag utility
  const getTagsList = () => {
    const list = ['All'];
    todos.forEach(t => {
      if (t.tag && !list.includes(t.tag)) {
        list.push(t.tag);
      }
    });
    return list;
  };

  const filteredTodos = todos.filter(t => selectedTag === 'All' || t.tag === selectedTag);

  // ----------------------------------------------------
  // VIEWS RENDERERS
  // ----------------------------------------------------
  if (currentView === 'auth') {
    return (
      <AuthPage
        authTab={authTab}
        setAuthTab={setAuthTab}
        authName={authName}
        setAuthName={setAuthName}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authError={authError}
        setAuthError={setAuthError}
        onSubmit={handleAuthSubmit}
      />
    );
  }

  if (currentView === 'shared') {
    return (
      <SharedPage
        sharedList={sharedList}
        sharedTodos={sharedTodos}
        sharedError={sharedError}
        sharedTotalCount={sharedTotalCount}
        sharedCompletedCount={sharedCompletedCount}
        sharedPendingCount={sharedPendingCount}
        sharedTagCounts={sharedTagCounts}
      />
    );
  }

  return (
    <DashboardPage
      user={user}
      lists={lists}
      activeList={activeList}
      setActiveList={setActiveList}
      todos={todos}
      selectedTag={selectedTag}
      setSelectedTag={setSelectedTag}
      isEditingList={isEditingList}
      setIsEditingList={setIsEditingList}
      editListTitle={editListTitle}
      setEditListTitle={setEditListTitle}
      newListName={newListName}
      setNewListName={setNewListName}
      newTodoTitle={newTodoTitle}
      setNewTodoTitle={setNewTodoTitle}
      newTodoTag={newTodoTag}
      setNewTodoTag={setNewTodoTag}
      copyFeedback={copyFeedback}
      totalCount={totalCount}
      completedCount={completedCount}
      pendingCount={pendingCount}
      tagCounts={tagCounts}
      filteredTodos={filteredTodos}
      getTagsList={getTagsList}
      handleCreateList={handleCreateList}
      startRenameList={startRenameList}
      handleUpdateListTitle={handleUpdateListTitle}
      handleDeleteList={handleDeleteList}
      handleToggleListPrivacy={handleToggleListPrivacy}
      handleShareList={handleShareList}
      copyShareLink={copyShareLink}
      handleCreateTodo={handleCreateTodo}
      handleToggleTodo={handleToggleTodo}
      handleUpdateTodo={handleUpdateTodo}
      handleDeleteTodo={handleDeleteTodo}
      handleLogout={handleLogout}
    />
  );
}

export default App;
