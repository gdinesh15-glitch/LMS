import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../style.css';

const SidebarItem = ({ icon: Icon, label, to }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `nav-link ${isActive ? 'active' : ''}`
      }
    >
      {typeof Icon === 'string' ? (
        <i className={`fas ${Icon}`}></i>
      ) : (
        <Icon className="w-4 h-4" />
      )}
      <span>{label}</span>
    </NavLink>
  );
};

const DashboardLayout = ({ sidebarGroups, title, subtitle, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);

  React.useEffect(() => {
    const fetchNotifs = async () => {
      const { DB } = await import('../utils/db');
      setNotifications(DB.get('notifications') || []);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    const { DB } = await import('../utils/db');
    const updated = notifications.map(n => ({ ...n, read: true }));
    DB.set('notifications', updated);
    setNotifications(updated);
  };


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const roleName = user?.role?.toLowerCase() || 'student';

  React.useEffect(() => {
    // Add classes to body
    const baseClass = 'dash-body';
    const portalClass = `portal-${roleName}`;
    document.body.classList.add(baseClass, portalClass);
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove(baseClass, portalClass);
    };
  }, [roleName]);

  return (
    <>
      <style>{`
        #root {
          display: flex;
          flex: 1;
          width: 100%;
          min-height: 100vh;
        }
      `}</style>
      {/* Portal Background Animation */}
      <div className="portal-bg" id="portalBg">
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>
        <div className="bg-orb"></div>
      </div>

      <div className="dash-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
          <div className="sb-top">
            <div className="sb-logo">
              <img src="https://www.vemu.ac.in/assets/images/logo.png" alt="VEMU" onError={(e) => { e.target.style.display='none'; e.target.nextElementSibling.style.display='flex' }} />
              <div className="sb-logo-fallback" style={{ display: 'none' }}><i className="fas fa-university"></i></div>
            </div>
            <div className="sb-brand">
              <span className="sb-college">VEMU</span>
              <span className="sb-dept">Library System</span>
            </div>
            <button className="sb-close" onClick={() => setSidebarOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="sb-user">
            <div className="sb-avatar" id="sbAvatar">{user?.name?.charAt(0) || 'U'}</div>
            <div className="sb-info">
              <div className="sb-name" id="sbName">{user?.name || 'User'}</div>
              <div className="sb-role-badge" id="sbRoleBadge">{user?.role || 'Guest'}</div>
            </div>
            <div className="sb-online"></div>
          </div>
          
          <nav className="sb-nav">
            {sidebarGroups.map((group, idx) => (
              <React.Fragment key={idx}>
                <div className="sb-section">{group.title}</div>
                {group.links.map((link, linkIdx) => (
                  <SidebarItem 
                    key={linkIdx} 
                    to={link.to} 
                    icon={link.icon} 
                    label={link.label} 
                  />
                ))}
              </React.Fragment>
            ))}
          </nav>

          <div className="sb-foot">
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </aside>

        <div className="main-area">
          <header className="topbar">
            <div className="tb-l">
              <button className="hamburger" onClick={() => setSidebarOpen(true)}>
                <i className="fas fa-bars"></i>
              </button>
              <div className="page-breadcrumb">
                <img src="https://www.vemu.ac.in/assets/images/logo.png" className="tb-logo" onError={(e) => e.target.style.display='none'} />
                <span id="pageTitle">{title || 'Dashboard'}</span>
              </div>
            </div>
            <div className="tb-r">
              <div className="tb-clock">
                <i className="fas fa-clock"></i><span id="tbClock">{formattedDate}</span>
              </div>
              <button className="tb-btn" onClick={toggleTheme}>
                <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} id="darkIcon"></i>
              </button>
              <div className="notif-wrapper" style={{ position: 'relative' }}>
                <button className={`tb-btn notif-btn ${showNotifs ? 'active' : ''}`} onClick={() => { setShowNotifs(!showNotifs); if (!showNotifs) markAllRead(); }}>
                  <i className="fas fa-bell"></i>
                  {unreadCount > 0 && (
                    <span className="notif-badge" id="notifBadge" style={{ display: 'flex' }}>{unreadCount}</span>
                  )}
                </button>
                
                {showNotifs && (
                  <div className="notif-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    width: '320px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    marginTop: '12px',
                    zIndex: 1000,
                    overflow: 'hidden'
                  }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Alerts</span>
                       <span style={{ fontSize: '10px', fontWeight: '900', backgroundColor: 'var(--accent-base)', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>{notifications.length}</span>
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? (
                        notifications.map((n, idx) => (
                          <div key={idx} style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', backgroundColor: n.bg, color: n.color, flexShrink: 0 }}>
                              <i className={`fas ${n.icon}`}></i>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.4' }}>{n.text}</div>
                              <div style={{ fontSize: '9px', fontWeight: '500', color: 'var(--text-muted)', marginTop: '4px' }}>{timeAgo(n.ts)}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          <i className="fas fa-bell-slash" style={{ fontSize: '24px', opacity: 0.2, marginBottom: '10px' }}></i>
                          <div style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}>No Notifications</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="content-area">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
