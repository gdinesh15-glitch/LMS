import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import PublicLayout from './pages/PublicLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';

// Dashboards
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import LibrarianDashboard from './pages/Dashboard/LibrarianDashboard';
import FacultyDashboard from './pages/Dashboard/FacultyDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      
      {/* Login Page (no layout) */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard Routes */}
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="/librarian/*" element={<LibrarianDashboard />} />
      <Route path="/faculty/*" element={<FacultyDashboard />} />
      <Route path="/student/*" element={<StudentDashboard />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

