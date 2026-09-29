import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DB, timeAgo } from '../../utils/db';
import userService from '../../api/services/userService';
import transactionService from '../../api/services/transactionService';
import { useAuth } from '../../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar } from 'recharts';

const StudentOverview = () => {
  const { user } = useAuth();
  const [issued, setIssued] = useState([]);
  const [stats, setStats] = useState({ active: 0, overdue: 0, fine: 0 });
  const [loading, setLoading] = useState(true);

  // Mock data for Student reading habits
  const readingData = [
    { name: 'Week 1', hours: 12 },
    { name: 'Week 2', hours: 18 },
    { name: 'Week 3', hours: 14 },
    { name: 'Week 4', hours: 22 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const statsRes = await userService.getStats();
      if (statsRes.success) {
        setStats({
          active: statsRes.data.active || 0,
          overdue: statsRes.data.overdue || 0,
          fine: statsRes.data.fine || 0
        });
      }

      const transRes = await transactionService.getUserTransactions(user?.userId || user?.id);
      if (transRes.success) {
        setIssued(transRes.data.filter(t => t.status === 'Issued'));
      }
      setLoading(false);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="p-8 text-center uppercase font-black text-slate-400 tracking-widest animate-pulse">Synchronizing Terminal...</div>;

  return (
    <div className="sec active" id="studentDashboardContent" style={{ animation: 'fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)', paddingBottom: '40px' }}>
      
      {/* Hero Banner */}
      <div style={{ 
        position: 'relative', overflow: 'hidden', padding: '40px', borderRadius: '24px', 
        background: 'linear-gradient(135deg, rgba(15,25,35,0.9), rgba(10,20,25,0.95))', 
        border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px'
      }}>
        {/* Decorative background glows */}
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: '#10b981', filter: 'blur(100px)', opacity: 0.15, borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '400px', height: '400px', background: '#3b82f6', filter: 'blur(120px)', opacity: 0.1, borderRadius: '50%', pointerEvents: 'none' }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '32px', fontWeight: '900', color: '#fff', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Academic Profile
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--t2)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '800' }}>
            Welcome back, {user?.name || 'Student'}
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '16px' }}>
          <div style={{ padding: '12px 20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '16px', color: '#f59e0b', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)' }}>
            <i className="fas fa-fire" style={{ fontSize: '14px' }}></i>
            12 Day Streak
          </div>
        </div>
      </div>

      {stats.overdue > 0 && (
        <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(225,29,72,0.15), rgba(225,29,72,0.05))', border: '1px solid rgba(225,29,72,0.3)', borderRadius: '24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 30px rgba(225,29,72,0.1)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#e11d48', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', boxShadow: '0 4px 12px rgba(225,29,72,0.4)' }}>
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div>
                 <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Return Mandatory</h3>
                 <p style={{ fontSize: '12px', color: '#fca5a5', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>You have {stats.overdue} book(s) past their deadline.</p>
              </div>
           </div>
           <Link to="/student/fines" style={{ padding: '12px 24px', background: '#e11d48', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px', boxShadow: '0 4px 12px rgba(225,29,72,0.3)' }}>Settle Dues</Link>
        </div>
      )}

      {/* Stats Row */}
      <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        
        <div className="stat-card" style={{ '--sc-color': '#3b82f6', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(59, 130, 246, 0.15)' }}><i className="fas fa-book-reader"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.active}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Books With Me</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-book-reader"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#e11d48', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(225, 29, 72, 0.15)' }}><i className="fas fa-clock"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.overdue}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overdue Items</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-clock"></i></div>
        </div>

        <div className="stat-card" style={{ '--sc-color': '#f59e0b', padding: '28px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent)', pointerEvents: 'none' }}></div>
            <div className="sc-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', width: '56px', height: '56px', fontSize: '24px', marginBottom: '20px', boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)' }}><i className="fas fa-rupee-sign"></i></div>
            <div className="sc-num" style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-0.03em', color: '#fff' }}>{stats.fine}</div>
            <div className="sc-label" style={{ fontSize: '13px', marginTop: '8px', color: 'var(--t2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Accrued Fine</div>
            <div className="sc-bg" style={{ fontSize: '100px', right: '-20px', bottom: '-20px', opacity: 0.03 }}><i className="fas fa-rupee-sign"></i></div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <i className="fas fa-chart-bar" style={{ color: '#10b981', marginRight: '12px' }}></i> Reading Velocity
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--t2)', fontWeight: '700', marginTop: '6px' }}>Hours spent interacting with library resources this month</p>
          </div>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={readingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--t2)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="var(--t2)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15,10,25,0.95)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', color: '#fff' }}
                itemStyle={{ fontWeight: '800' }}
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
              />
              <Bar dataKey="hours" name="Reading Hours" fill="url(#colorHours)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default StudentOverview;
