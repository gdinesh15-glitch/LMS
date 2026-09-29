import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const LayoutWrapper = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = (state) => {
    setSidebarOpen(typeof state === 'boolean' ? state : !sidebarOpen);
  };

  // Derive page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    if (segments.length <= 1) return '';
    return segments.slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' › ');
  };

  return (
    <div className="lms-layout">
      {user && <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />}

      <div className={`lms-main-content ${user ? 'with-sidebar' : 'full-width'}`}>
        <Navbar toggleSidebar={() => toggleSidebar()} pageTitle={getPageTitle()} />
        <main className="lms-page-container">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && user && (
        <div className="lms-sidebar-overlay" onClick={() => toggleSidebar(false)}></div>
      )}
    </div>
  );
};

export default LayoutWrapper;
