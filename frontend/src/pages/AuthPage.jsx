import React from 'react';

function AuthPage({
  authTab,
  setAuthTab,
  authName,
  setAuthName,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authError,
  setAuthError,
  onSubmit
}) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Todo Workspace</h2>
          <p>{authTab === 'login' ? 'Welcome back! Sign in to continue.' : 'Create an account to start organizing.'}</p>
        </div>
        
        <div className="auth-tabs">
          <div 
            className={`auth-tab ${authTab === 'login' ? 'active' : ''}`}
            onClick={() => { setAuthTab('login'); setAuthError(''); }}
          >
            Sign In
          </div>
          <div 
            className={`auth-tab ${authTab === 'register' ? 'active' : ''}`}
            onClick={() => { setAuthTab('register'); setAuthError(''); }}
          >
            Sign Up
          </div>
        </div>

        {authError && <div className="auth-error">{authError}</div>}

        <form onSubmit={onSubmit}>
          {authTab === 'register' && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                className="input-field" 
                placeholder="John Doe" 
                value={authName}
                onChange={e => setAuthName(e.target.value)}
                required 
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              placeholder="you@example.com" 
              value={authEmail}
              onChange={e => setAuthEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={authPassword}
              onChange={e => setAuthPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
            {authTab === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
