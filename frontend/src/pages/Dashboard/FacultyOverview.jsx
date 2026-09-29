import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Clock, AlertCircle, 
  CheckCircle, Bookmark, Star, ArrowUpRight,
  TrendingUp, Calendar, Bell, History, Info
} from 'lucide-react';
import { Card, Badge } from '../../components/SharedUI';
import api from '../../api/axios';

const FacultyOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/faculty/dashboard');
      if (res.data) {
        setData(res.data);
      } else {
        setError('No data received from institutional server');
      }
    } catch (err) {
      console.error('Failed to fetch faculty stats:', err);
      setError('Connection to Academic Protocol failed');
    }
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  const cardStyle = { 
    background: 'rgba(15,23,42,0.4)', 
    border: '1px solid rgba(51,65,85,0.3)', 
    backdropFilter: 'blur(24px)' 
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 animate-in fade-in">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-xs font-black text-white uppercase tracking-[0.3em] opacity-40">Synchronizing Institutional Records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-6 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 opacity-50" />
        <div className="space-y-1">
          <p className="text-sm font-black text-white uppercase tracking-widest">{error}</p>
          <button onClick={fetchStats} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Retry Protocol Engagement</button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Active Loans', value: data?.stats?.activeLoans || 0, icon: BookOpen, color: 'indigo' },
    { label: 'Reserved Books', value: data?.stats?.reservations || 0, icon: Bookmark, color: 'blue' },
    { label: 'Due Soon', value: data?.stats?.dueSoon || 0, icon: Clock, color: 'rose' },
    { label: 'Total Borrowed', value: data?.stats?.borrowingHistoryCount || 0, icon: History, color: 'emerald' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tight">Academic Overview</h1>
          <p className="text-xs font-medium text-slate-500">Real-time status of your institutional asset engagements.</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="h-12 px-5 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-center gap-3 text-xs font-bold text-slate-400">
            <Clock className="w-4 h-4 text-indigo-500" /> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} style={cardStyle} className="p-8 rounded-[2rem] flex items-center gap-5 group transition-all hover:border-slate-600">
             <div className={`w-14 h-14 rounded-2xl bg-${s.color}-500/10 border border-${s.color}-500/20 flex items-center justify-center text-${s.color}-400 group-hover:scale-105 transition-transform`}>
                <s.icon className="w-7 h-7" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{s.value}</h3>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Active Loans Table */}
        <div className="lg:col-span-8 rounded-[2.5rem] overflow-hidden" style={cardStyle}>
          <div className="p-8 border-b border-slate-800 bg-slate-900/20 flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="font-black text-white uppercase tracking-wider text-sm">Active Academic Loans</h3>
             </div>
             <span className="px-4 py-1.5 rounded-full bg-slate-800 text-[9px] font-black text-slate-400 uppercase tracking-widest">Limit: {data?.stats?.borrowingLimit || 10}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-950/20 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800">
                  <th className="py-5 px-8">Asset Specification</th>
                  <th className="py-5 px-8">Temporal Deadline</th>
                  <th className="py-5 px-8 text-right">Engagement State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {data?.recentLoans?.map(l => (
                  <tr key={l._id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-8">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-sm text-white group-hover:text-indigo-400 transition-colors">{l.book?.title}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{l.book?.author}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">
                       <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-slate-600" />
                          <span className="text-xs font-bold text-slate-400">{new Date(l.dueDate).toLocaleDateString()}</span>
                       </div>
                    </td>
                    <td className="py-5 px-8 text-right">
                       <Badge type={l.status === 'Overdue' ? 'overdue' : 'primary'}>{l.status.toUpperCase()}</Badge>
                    </td>
                  </tr>
                ))}
                {(!data?.recentLoans || data.recentLoans.length === 0) && (
                  <tr>
                    <td colSpan="3" className="py-24 text-center">
                       <div className="space-y-4 opacity-20">
                          <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
                          <p className="text-xs font-black text-white uppercase tracking-[0.2em]">No Active Academic Engagements</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 rounded-[2.5rem] flex flex-col h-full" style={cardStyle}>
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                      <Bell className="w-5 h-5" />
                   </div>
                   <h3 className="font-black text-white uppercase tracking-wider text-sm">System Alerts</h3>
                </div>
             </div>
             
             <div className="space-y-4 flex-1">
                {data?.notifications?.map(n => (
                  <div key={n.id} className={`p-5 rounded-2xl bg-${n.type === 'warning' ? 'rose' : 'indigo'}-500/5 border border-${n.type === 'warning' ? 'rose' : 'indigo'}-500/10 flex items-start gap-4 group transition-all hover:bg-white/[0.02]`}>
                     <div className={`mt-1 w-2 h-2 rounded-full bg-${n.type === 'warning' ? 'rose' : 'indigo'}-500 shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
                     <p className="text-[11px] font-bold text-slate-300 leading-relaxed uppercase tracking-tight">{n.message}</p>
                  </div>
                ))}
                {(!data?.notifications || data.notifications.length === 0) && (
                  <div className="py-20 text-center space-y-4 opacity-20">
                     <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                     <p className="text-xs font-black text-white uppercase tracking-widest">Protocol Nominal</p>
                  </div>
                )}
             </div>
             
             <button className="w-full mt-8 py-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all">
                Access Notification Registry
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FacultyOverview;
