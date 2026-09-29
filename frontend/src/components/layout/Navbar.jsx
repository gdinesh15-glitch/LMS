import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DB } from '../../utils/db';

const Navbar = ({ toggleSidebar, pageTitle }) => {
  const { user } = useAuth();
  const notifications = DB.get('notifications') || [];
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="lms-navbar">
      <div className="lms-navbar-left">
        {user && (
          <button className="lms-menu-btn" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
        )}
        {pageTitle && <span className="lms-page-title">{pageTitle}</span>}
      </div>
      <div className="lms-navbar-right">
        {user && (
          <div className="lms-nav-actions">
            <button className="lms-icon-btn" title="Notifications">
              <i className="fas fa-bell"></i>
              {unread > 0 && <span className="lms-badge">{unread}</span>}
            </button>
            <button className="lms-icon-btn" title="Settings">
              <i className="fas fa-cog"></i>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
