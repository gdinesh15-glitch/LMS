import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Sidebar = ({ navItems, isOpen, toggle }) => {
  const { user, logout } = useApp();

  if (!user) return null;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sb-top">
        <div className="sb-logo">
          <i className="fas fa-university" style={{ fontSize: '24px', color: '#fff' }}></i>
        </div>
        <div className="sb-brand">
          <span className="sb-college">VEMU</span>
          <span className="sb-dept">Library System</span>
        </div>
        <button className="sb-close" onClick={toggle}><i className="fas fa-times"></i></button>
      </div>

      <div className="sb-user">
        <div className="sb-avatar-wrap">
          <div className="sb-avatar">{user.name.charAt(0)}</div>
          <div className="sb-status-dot"></div>
        </div>
        <div className="sb-info">
          <div className="sb-name">{user.name}</div>
          <div className="sb-role-badge">{user.role}</div>
        </div>
      </div>

      <nav className="sb-nav">
        {navItems.map((item, i) => {
          if (item.section) return <div className="sb-section" key={`sec-${i}`}>{item.section}</div>;
          return (
            <button
              key={item.id}
              className={`nav-link ${item.active ? 'active' : ''}`}
              onClick={() => { item.onClick(); toggle(false); }}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sb-foot">
        <button className="logout-btn" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
