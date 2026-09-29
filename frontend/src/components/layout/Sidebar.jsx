import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggle }) => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const roleColor = { admin: 'var(--accent-red)', librarian: 'var(--accent-blue)', student: 'var(--accent-green)', faculty: 'var(--accent-purple)' };

  const navConfig = {
    admin: [
      { section: 'Overview' },
      { path: '/admin', label: 'Dashboard', icon: 'fa-chart-line', end: true },
      { section: 'Management' },
      { path: '/admin/users', label: 'User Management', icon: 'fa-users-cog' },
      { path: '/admin/config', label: 'System Config', icon: 'fa-sliders-h' },
      { path: '/admin/branches', label: 'Branches', icon: 'fa-building' },
      { section: 'Monitoring' },
      { path: '/admin/reports', label: 'Reports', icon: 'fa-chart-bar' },
      { path: '/admin/logs', label: 'Audit Logs', icon: 'fa-shield-alt' },
    ],
    librarian: [
      { section: 'Overview' },
      { path: '/librarian', label: 'Circulation Desk', icon: 'fa-barcode', end: true },
      { section: 'Catalog' },
      { path: '/librarian/catalog', label: 'Manage Catalog', icon: 'fa-book' },
      { path: '/librarian/inventory', label: 'Inventory Audit', icon: 'fa-boxes-stacked' },
      { section: 'Operations' },
      { path: '/librarian/fines', label: 'Fines & Payments', icon: 'fa-money-bill-wave' },
      { path: '/librarian/holds', label: 'Hold Queue', icon: 'fa-layer-group' },
    ],
    student: [
      { section: 'Overview' },
      { path: '/student', label: 'My Dashboard', icon: 'fa-user', end: true },
      { section: 'Library' },
      { path: '/student/search', label: 'Catalog Search', icon: 'fa-search' },
      { path: '/student/digital', label: 'Digital Library', icon: 'fa-tablet-alt' },
      { section: 'Personal' },
      { path: '/student/fines', label: 'My Fines', icon: 'fa-receipt' },
      { path: '/student/wishlist', label: 'My Wishlist', icon: 'fa-heart' },
    ],
    faculty: [
      { section: 'Overview' },
      { path: '/faculty', label: 'Dashboard', icon: 'fa-chalkboard-teacher', end: true },
      { section: 'Academic' },
      { path: '/faculty/reserves', label: 'Course Reserves', icon: 'fa-book-reader' },
      { path: '/faculty/procurement', label: 'Purchase Requests', icon: 'fa-cart-plus' },
      { path: '/faculty/ill', label: 'Inter-Library Loan', icon: 'fa-exchange-alt' },
      { section: 'Tools' },
      { path: '/faculty/search', label: 'Catalog Search', icon: 'fa-search' },
    ],
  };

  const items = navConfig[user.role] || [];

  return (
    <aside className={`lms-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="lms-sidebar-header">
        <span className="lms-brand">📚 BiblioTech</span>
        <button className="lms-close-btn" onClick={() => toggle(false)}><i className="fas fa-times"></i></button>
      </div>

      <div className="lms-user-profile">
        <div className="lms-avatar" style={{ background: `linear-gradient(135deg, ${roleColor[user.role]}, var(--accent-purple))` }}>
          {user.name?.charAt(0) || 'U'}
        </div>
        <div className="lms-user-info">
          <p className="lms-name">{user.name}</p>
          <span className="lms-role-badge" data-role={user.role}>{user.role}</span>
        </div>
      </div>

      <nav className="lms-nav-menu">
        {items.map((item, idx) => {
          if (item.section) {
            return <div className="lms-nav-section" key={`sec-${idx}`}>{item.section}</div>;
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end || false}
              className={({ isActive }) => `lms-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => toggle(false)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="lms-sidebar-footer">
        <button className="lms-logout-btn" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
