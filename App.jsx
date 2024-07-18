import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Notes from './Notes';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username, userId) => {
    console.log('Logging in:', { username, userId });
    setUser({ username, userId });
  };

  console.log('Current user:', user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/notes" /> : <Login onLogin={handleLogin} />} />
        <Route path="/notes" element={user ? <Notes userId={user.userId} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
