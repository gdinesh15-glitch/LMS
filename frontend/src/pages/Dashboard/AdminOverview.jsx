import React, { useState, useEffect } from 'react';
import userService from '../../api/services/userService';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

/* ── Animated Counter ────────────────────────────────────────────── */
const AnimNum = ({ value, duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const n = typeof value === 'number' ? value : 0;
    if (n === 0) { setDisplay(0); return; }
    let start = 0;
    const step = Math.max(1, Math.ceil(n / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= n) { setDisplay(n); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
};

/* ── Time ago helper ─────────────────────────────────────────────── */
const timeAgo = (ts) => {
  if (!ts) return '';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

/* ══ AdminOverview ═══════════════════════════════════════════════ */
const AdminOverview = () => {
  const [stats, setStats] = useState({
    students: 0, faculty: 0, librarians: 0, books: 0,
    issued: 0, overdue: 0, availableBooks: 0, donations: 0,
    categories: [], recentActivity: [], weeklyData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await userService.getStats();
      if (res.success) setStats(res.data);
      setLoading(false);
    };
    fetchStats();
  }, []);

  const card = { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(20px)' };

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: 'fa-user-graduate', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    { label: 'Total Books', value: stats.books, icon: 'fa-book', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Active Loans', value: stats.issued, icon: 'fa-hand-holding-heart', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
    { label: 'Faculty Members', value: stats.faculty, icon: 'fa-chalkboard-teacher', color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Librarians', value: stats.librarians, icon: 'fa-user-tie', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Available Copies', value: stats.availableBooks, icon: 'fa-book-open', color: '#06b6d4', bg: 'rgba(6,182,212,0.12)' },
  ];

  const quickActions = [
    { to: '/admin/add-student', icon: 'fa-user-plus', label: 'Add Student', color: '#ef4444' },
    { to: '/admin/books', icon: 'fa-book-medical', label: 'New Asset', color: '#10b981' },
    { to: '/admin/users', icon: 'fa-users-cog', label: 'Manage Users', color: '#8b5cf6' },
    { to: '/admin/add-faculty', icon: 'fa-chalkboard-teacher', label: 'Add Faculty', color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen w-full p-4 md:p-6 space-y-6" style={{ background: 'transparent' }}>

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '36px 40px', borderRadius: '20px', ...card }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: '#6366f1', filter: 'blur(100px)', opacity: 0.12, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: '#8b5cf6', filter: 'blur(120px)', opacity: 0.08, borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '6px' }}>System Intelligence</h2>
            <p style={{ fontSize: '12px', color: 'rgba(148,163,184,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700' }}>
              VEMU Library — Live Dashboard ({loading ? 'loading…' : 'synced'})
            </p>
          </div>
          <div style={{ padding: '10px 18px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '14px', color: '#10b981', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            All Systems Operational
          </div>
        </div>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {statCards.map((s, i) => (
          <div key={i} className="rounded-2xl p-6 relative overflow-hidden" style={card}>
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', fontSize: '80px', opacity: 0.03, color: s.color, pointerEvents: 'none' }}>
              <i className={`fas ${s.icon}`} />
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: `0 6px 20px ${s.bg}` }}>
              <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: '20px' }} />
            </div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {loading ? <span style={{ opacity: 0.3 }}>—</span> : <AnimNum value={s.value} />}
            </div>
            <div style={{ fontSize: '11px', marginTop: '8px', color: 'rgba(148,163,184,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Charts Row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* Weekly Activity Chart */}
        <div className="rounded-2xl p-6" style={card}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>
            <i className="fas fa-chart-line" style={{ color: '#8b5cf6', marginRight: '10px' }} />
            Weekly User Registrations
          </h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.weeklyData?.length ? stats.weeklyData : [{ name: '-', newUsers: 0 }]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="gNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'rgba(15,10,25,0.95)', border: '1px solid rgba(51,65,85,0.6)', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                <Area type="monotone" dataKey="newUsers" name="New Users" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#gNew)" activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Book Categories Chart */}
        <div className="rounded-2xl p-6" style={card}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>
            <i className="fas fa-layer-group" style={{ color: '#3b82f6', marginRight: '10px' }} />
            Book Categories
          </h3>
          <div style={{ height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categories?.length ? stats.categories : [{ name: 'No data', count: 0 }]} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(148,163,184,0.5)" fontSize={10} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="rgba(148,163,184,0.5)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'rgba(15,10,25,0.95)', border: '1px solid rgba(51,65,85,0.6)', borderRadius: '10px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" name="Books" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Quick Actions + Activity ───────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>

        {/* Quick Actions */}
        <div className="rounded-2xl p-6" style={card}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>
            <i className="fas fa-bolt" style={{ color: '#f59e0b', marginRight: '10px' }} />
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {quickActions.map((q, i) => (
              <Link key={i} to={q.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 16px', borderRadius: '16px', gap: '12px', textDecoration: 'none', color: '#e2e8f0', transition: 'all 0.25s', background: 'rgba(15,23,42,0.5)', border: '1px solid rgba(51,65,85,0.5)', textAlign: 'center' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = q.color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${q.color}20`; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.5)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${q.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: q.color }}>
                  <i className={`fas ${q.icon}`} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-2xl p-6 flex flex-col" style={card}>
          <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '20px' }}>
            <i className="fas fa-history" style={{ color: '#ec4899', marginRight: '10px' }} />
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
            {stats.recentActivity?.length > 0 ? stats.recentActivity.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '14px 16px', borderRadius: '14px', border: '1px solid rgba(51,65,85,0.4)', background: 'rgba(15,23,42,0.4)', transition: 'all 0.2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(51,65,85,0.4)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: '40px', height: '40px', flexShrink: 0, borderRadius: '12px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', fontSize: '16px' }}>
                  <i className="fas fa-user-plus" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', color: '#fff', fontWeight: '600', lineHeight: 1.4 }}>{a.text}</p>
                  <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.6)', display: 'flex', gap: '12px', marginTop: '5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <span><i className="fas fa-id-badge" style={{ fontSize: '9px', marginRight: '4px' }} />{a.userId}</span>
                    <span style={{ color: 'rgba(236,72,153,0.7)' }}><i className="fas fa-clock" style={{ fontSize: '9px', marginRight: '4px' }} />{timeAgo(a.ts)}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ padding: '40px', textAlign: 'center', color: 'rgba(100,116,139,0.6)', borderRadius: '14px', border: '1px dashed rgba(51,65,85,0.5)' }}>
                <i className="fas fa-inbox" style={{ fontSize: '24px', opacity: 0.3, marginBottom: '10px', display: 'block' }} />
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>No recent activity</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
};

export default AdminOverview;
