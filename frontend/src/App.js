import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './Module/User/Ucomponent/Login';
import Register from './Module/User/Ucomponent/Register';
import Dashboard from './Module/User/Ucomponent/Dashboard';
import AddWorkout from './Module/User/Ucomponent/AddWorkout';
import EditWorkout from './Module/User/Ucomponent/EditWorkout';
import WeeklyView from './Module/User/Ucomponent/WeeklyView';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/add-workout" 
              element={
                <ProtectedRoute>
                  <AddWorkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-workout/:id" 
              element={
                <ProtectedRoute>
                  <EditWorkout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/weekly-view" 
              element={
                <ProtectedRoute>
                  <WeeklyView />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
