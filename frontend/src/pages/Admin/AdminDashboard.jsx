import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DB, today, fmtDate, timeAgo } from '../../utils/db';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [issued, setIssued] = useState([]);

  useEffect(() => {
    setUsers(DB.get('users') || []);
    setBooks(DB.get('books') || []);
    setActivities(DB.get('activity') || []);
    setIssued(DB.get('issued') || []);
  }, []);

  const librarians = users.filter(u => u.role === 'librarian');
  const faculty = users.filter(u => u.role === 'faculty');
  const students = users.filter(u => u.role === 'student');
  const totalBooks = books.reduce((a, b) => a + (b.qty || 0), 0);
  const activeLoans = issued.filter(i => i.status !== 'returned').length;
  const overdueLoans = issued.filter(i => i.status !== 'returned' && i.dueDate < today()).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">{fmtDate(today())} — System Overview</p>
        </div>
      </div>

      <div className="welcome-card">
        <div className="welcome-avatar">👋</div>
        <div>
          <h3>Welcome back, {user.name}!</h3>
          <p>System is running smoothly. {overdueLoans > 0 ? `${overdueLoans} overdue alert(s).` : '0 critical alerts.'}</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Librarians" value={librarians.length} icon="fa-user-tie" color="var(--accent-blue)" bg="rgba(56,189,248,.12)" />
        <StatCard label="Faculty" value={faculty.length} icon="fa-chalkboard-teacher" color="var(--accent-purple)" bg="rgba(167,139,250,.12)" />
        <StatCard label="Students" value={students.length} icon="fa-user-graduate" color="var(--accent-green)" bg="rgba(110,231,183,.12)" />
        <StatCard label="Total Books" value={totalBooks} icon="fa-book" color="var(--accent-amber)" bg="rgba(253,230,138,.12)" />
        <StatCard label="Active Loans" value={activeLoans} icon="fa-arrow-right-arrow-left" color="var(--accent-orange)" bg="rgba(253,186,116,.12)" />
        <StatCard label="Overdue" value={overdueLoans} icon="fa-exclamation-triangle" color="var(--accent-red)" bg="rgba(248,113,113,.12)" />
      </div>

      <div className="content-grid">
        <div className="lms-card">
          <div className="lms-card-header"><h3><i className="fas fa-stream" style={{ marginRight: '8px', opacity: 0.5 }}></i>Recent Activity</h3></div>
          <div className="lms-card-body">
            <div className="activity-list">
              {activities.slice(0, 8).map((a, i) => (
                <div key={i} className="activity-item">
                  <div className="activity-icon" style={{ background: a.bg, color: a.color }}><i className={`fas ${a.icon}`}></i></div>
                  <div>
                    <div className="activity-text">{a.text}</div>
                    <div className="activity-time">{timeAgo(a.ts)}</div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && <div className="empty-state"><i className="fas fa-inbox"></i><p>No activity yet</p></div>}
            </div>
          </div>
        </div>

        <div className="lms-card">
          <div className="lms-card-header"><h3><i className="fas fa-chart-pie" style={{ marginRight: '8px', opacity: 0.5 }}></i>User Distribution</h3></div>
          <div className="lms-card-body">
            <DistRow label="Librarians" count={librarians.length} total={users.length} color="var(--accent-blue)" />
            <DistRow label="Faculty" count={faculty.length} total={users.length} color="var(--accent-purple)" />
            <DistRow label="Students" count={students.length} total={users.length} color="var(--accent-green)" />

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Popular Categories</h4>
              {['Java', 'Python', 'AI/ML', 'Web Development', 'Data Structures'].map(cat => {
                const count = books.filter(b => b.category === cat).length;
                return <DistRow key={cat} label={cat} count={count} total={books.length} color="var(--accent-cyan)" />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color, bg }) => (
  <div className="stat-card">
    <div className="sc-icon" style={{ background: bg, color }}><i className={`fas ${icon}`}></i></div>
    <div className="sc-value" style={{ color }}>{value}</div>
    <div className="sc-label">{label}</div>
    <div className="sc-bg"><i className={`fas ${icon}`}></i></div>
  </div>
);

const DistRow = ({ label, count, total, color }) => {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="dist-row">
      <div className="dist-label">{label}</div>
      <div className="dist-bar-wrap"><div className="dist-bar" style={{ width: `${pct}%`, background: color }}></div></div>
      <div className="dist-count" style={{ color }}>{count}</div>
    </div>
  );
};

export default AdminDashboard;
