// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import AdminDashboard from './components/Dashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Simulated login function
  const handleSignIn = (username, password) => {
    // Replace with real authentication logic
    if (username === 'admin' && password === 'admin123') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* SignIn page */}
        <Route 
          path="/signin" 
          element={<SignIn onSignIn={handleSignIn} />} 
        />

        {/* Admin Dashboard (protected) */}
        <Route 
          path="/admin/dashboard" 
          element={isLoggedIn ? <AdminDashboard /> : <Navigate to="/signin" />} 
        />

        {/* Default route redirects to SignIn */}
        <Route 
          path="*" 
          element={<Navigate to="/signin" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
