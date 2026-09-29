import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const Topbar = ({ toggleSidebar, title, section }) => {
  const { notifications, markNotifRead, clearNotifs, user } = useApp();
  const [showNotif, setShowNotif] = useState(false);
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => {
      setClock(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="topbar">
      <div className="tb-l">
        <button className="hamburger" onClick={toggleSidebar} aria-label="Toggle Sidebar"><i className="fas fa-bars"></i></button>
        <div className="page-breadcrumb">
          <span style={{ fontWeight: 600, color: 'var(--t1)' }}>{section}</span>
          {title && (
            <>
              <i className="fas fa-chevron-right" style={{ fontSize: '12px', margin: '0 8px', opacity: 0.5 }}></i>
              <span style={{ color: 'var(--t2)' }}>{title}</span>
            </>
          )}
        </div>
      </div>

      <div className="tb-r">
        <div className="tb-clock"><i className="fas fa-clock"></i> <span>{clock}</span></div>

        <div className="tb-notif" onClick={() => setShowNotif(!showNotif)}>
          <i className="fas fa-bell"></i>
          {unreadCount > 0 && <span className="notif-badgePulse">{unreadCount}</span>}
        </div>

        {showNotif && (
          <div className="notif-panel active">
            <div className="notif-hd">
              <h3>Notifications</h3>
              <button className="clear-all" onClick={clearNotifs}>Clear All</button>
            </div>
            <div className="notif-list">
              {notifications.length === 0 ? (
                <div className="notif-empty">No new notifications</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`notif-item ${n.read ? 'read' : ''}`} onClick={() => markNotifRead(n.id)}>
                    <div className="ni-icon" style={{ background: n.bg, color: n.color }}><i className={`fas ${n.icon}`}></i></div>
                    <div className="ni-txt">
                      <div className="ni-msg">{n.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="tb-user">
          <div className="sb-avatar" style={{ width: '32px', height: '32px', fontSize: '14px' }}>{user?.name.charAt(0)}</div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
