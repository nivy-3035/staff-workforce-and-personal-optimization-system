// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simple login function (replace with real auth)
  const handleSignIn = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <Routes>
      {/* SignIn page */}
      <Route path="/signin" element={<Signin onSignIn={handleSignIn} />} />

      {/* Dashboard page (protected route) */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <Dashboard /> : <Navigate to="/signin" />}
      />

      {/* Default route redirects to SignIn */}
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
}

export default App;
