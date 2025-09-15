import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// Correcting import paths to assume all components are in the same directory.
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import CustomerForm from './components/CustomerForm';

function App() {
  // A helper component to check for authentication and render the header
  const ProtectedLayout = ({ children }) => {
    const isAuthenticated = localStorage.getItem("access");
    return (
      <div>
        {isAuthenticated && <Header />}
        {children}
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedLayout>
              <ProfilePage />
            </ProtectedLayout>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
           
              <Dashboard />
            
          } 
        />
        <Route 
          path="/addcustomer" 
          element={
            <ProtectedLayout>
              <CustomerForm />
            </ProtectedLayout>
          } 
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
