import React, { useState, useEffect } from 'react';
import { 
  BookOpen, BookMarked, RotateCcw, CheckCircle, 
  IndianRupee, AlertTriangle, Search, Plus, 
  RefreshCw, FileBarChart, Clock, ChevronRight,
  TrendingUp, Users, GraduationCap, UserCheck, Bell
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const LibrarianOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issueSearch, setIssueSearch] = useState({ member: '', book: '' });
  const [returnSearch, setReturnSearch] = useState({ member: '', book: '' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/librarian/stats');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cardStyle = { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(20px)' };
  const statCardBase = "p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden transition-all hover:scale-[1.02]";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-indigo-400">
        <RefreshCw className="w-10 h-10 animate-spin" />
        <span className="text-sm font-bold uppercase tracking-widest">Initialising Librarian Console...</span>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#e11d48', '#f59e0b', '#10b981', '#a855f7', '#94a3b8'];

  const handleIssue = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = { userId: fd.get('userId'), bookId: fd.get('bookId'), dueDate: fd.get('dueDate') };
    try {
      const res = await api.post('/librarian/issue', payload);
      if (res.data.success) {
        alert('✅ Book issued successfully!');
        e.target.reset();
        window.location.reload(); // Refresh stats
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Issue failed');
    }
  };

  const handleReturn = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = { userId: fd.get('userId'), bookId: fd.get('bookId') };
    try {
      const res = await api.post('/librarian/return', payload);
      if (res.data.success) {
        alert(`✅ Book returned! ${res.data.fine > 0 ? `Fine: ₹${res.data.fine}` : ''}`);
        e.target.reset();
        window.location.reload(); // Refresh stats
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Return failed');
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 space-y-6" style={{ background: 'transparent' }}>
      
      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1.5 tracking-tight">Librarian Command Centre</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 opacity-80">
            Real-time library administration & resource tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-700/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>

      {/* ── Stats Cards Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Books (Unique Titles) */}
        <div className={statCardBase} style={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Books</p>
            <h4 className="text-xl font-black text-white">{data?.stats?.totalBooks || 0}</h4>
            <p className="text-[9px] text-slate-400 font-bold mt-1">{data?.stats?.totalVolumes || 0} Total Volumes</p>
          </div>
        </div>

        {/* Books Issued */}
        <div className={statCardBase} style={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Books Issued</p>
            <h4 className="text-xl font-black text-white">{data?.stats?.issuedBooks || 0}</h4>
            <p className="text-[9px] text-emerald-400 font-bold mt-1">Active Loans</p>
          </div>
        </div>

        {/* Books Returned Today */}
        <div className={statCardBase} style={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Returned Today</p>
            <h4 className="text-xl font-black text-white">{data?.stats?.returnsToday || 0}</h4>
            <p className="text-[9px] text-emerald-400 font-bold mt-1">Updated recently</p>
          </div>
        </div>

        {/* Available Books */}
        <div className={statCardBase} style={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Available</p>
            <h4 className="text-xl font-black text-white">{data?.stats?.availableBooks || 0}</h4>
            <p className="text-[9px] text-slate-400 font-bold mt-1">In Stock</p>
          </div>
        </div>

        {/* Pending Fines */}
        <div className={statCardBase} style={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending Fines</p>
            <h4 className="text-xl font-black text-white">₹{data?.stats?.pendingFines || 0}</h4>
            <p className="text-[9px] text-rose-400 font-bold mt-1">Total Outstanding</p>
          </div>
        </div>

        {/* Overdue Books */}
        <div className={statCardBase} style={cardStyle}>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overdue</p>
            <h4 className="text-xl font-black text-white">{data?.stats?.overdueBooks || 0}</h4>
            <p className="text-[9px] text-rose-400 font-bold mt-1">Action Required</p>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Issue & Return Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Issue Book Widget */}
            <form onSubmit={handleIssue} className="rounded-3xl p-6 space-y-4" style={cardStyle}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <BookMarked className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Issue Book</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Assign book to member</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Member ID</label>
                  <input name="userId" required className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl h-10 px-4 text-xs text-white outline-none focus:border-indigo-500/50" placeholder="e.g. STU-001" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Book ID</label>
                  <input name="bookId" required className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl h-10 px-4 text-xs text-white outline-none focus:border-indigo-500/50" placeholder="e.g. BK0001" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
                  <input name="dueDate" type="date" required className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl h-10 px-4 text-xs text-white outline-none focus:border-indigo-500/50" defaultValue={new Date(Date.now() + 14*86400000).toISOString().split('T')[0]} />
                </div>
                <button type="submit" className="w-full h-10 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                  Initialize Issue
                </button>
              </div>
            </form>

            {/* Return Book Widget */}
            <form onSubmit={handleReturn} className="rounded-3xl p-6 space-y-4" style={cardStyle}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">Return Book</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Process asset recovery</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Member ID</label>
                  <input name="userId" required className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl h-10 px-4 text-xs text-white outline-none focus:border-emerald-500/50" placeholder="Enter member ID" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Book ID</label>
                  <input name="bookId" required className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl h-10 px-4 text-xs text-white outline-none focus:border-emerald-500/50" placeholder="Enter book ID" />
                </div>
                <div className="h-10 invisible" />
                <button type="submit" className="w-full h-10 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                  Confirm Return
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Grid: Inventory & Transactions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book Inventory Donut */}
            <div className="rounded-3xl p-6" style={cardStyle}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Book Inventory Overview</h3>
                <select className="bg-transparent text-[10px] font-bold text-slate-400 border-none outline-none cursor-pointer">
                  <option>This Month</option>
                  <option>Overall</option>
                </select>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.categories || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {(data?.categories || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                         contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                         itemStyle={{ color: '#fff', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-xl font-black text-white">{data?.stats?.totalBooks || 0}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Total Books</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                  {data?.categories?.slice(0, 4).map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-[10px] font-bold text-slate-400 truncate w-24">{c.name}</span>
                      <span className="text-[10px] font-black text-white">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="rounded-3xl p-6" style={cardStyle}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Recent Transactions</h3>
                <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {data?.recentTransactions?.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.type === 'Issue' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-white truncate w-40">{t.type} Book</h4>
                        <span className="text-[9px] font-medium text-slate-500">{new Date(t.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 italic">{t.book}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">To: {t.user} ({t.userId})</p>
                    </div>
                  </div>
                ))}
                {(!data?.recentTransactions || data.recentTransactions.length === 0) && (
                   <div className="text-center py-12 text-slate-500 text-xs font-bold uppercase tracking-widest">No Recent Activity</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Grid */}
          <div className="rounded-3xl p-6" style={cardStyle}>
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Plus, label: 'Add New Book', color: 'indigo', to: '/librarian/catalog?action=add' },
                { icon: BookOpen, label: 'View All Books', color: 'blue', to: '/librarian/catalog' },
                { icon: BookMarked, label: 'Issue Book', color: 'emerald', to: '/librarian/circulation' },
                { icon: RotateCcw, label: 'Return Book', color: 'amber', to: '/librarian/return' },
                { icon: IndianRupee, label: 'Calculate Fine', color: 'rose', to: '/librarian/fines' },
                { icon: UserCheck, label: 'Book Availability', color: 'cyan', to: '/librarian/catalog' },
                { icon: FileBarChart, label: 'Issue/Return Report', color: 'purple', to: '/librarian/activity' },
                { icon: AlertTriangle, label: 'Overdue Books', color: 'pink', to: '/librarian/fines' },
              ].map((act, i) => (
                <a key={i} href={act.to} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all gap-2 group">
                   <div className={`w-8 h-8 rounded-lg bg-${act.color}-500/20 text-${act.color}-400 flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <act.icon className="w-4 h-4" />
                   </div>
                   <span className="text-[9px] font-black text-white uppercase text-center leading-tight tracking-tighter">{act.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Fines Overview */}
          <div className="rounded-3xl p-6" style={cardStyle}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Fines Overview</h3>
              <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
               <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Pending Fines</p>
                  <h4 className="text-lg font-black text-white">₹{data?.stats?.pendingFines || 0}</h4>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Collected Fines</p>
                  <h4 className="text-lg font-black text-white">₹18,750</h4>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">This Month Collection</p>
                  <h4 className="text-lg font-black text-white">₹3,250</h4>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Total Users Fined</p>
                  <h4 className="text-lg font-black text-white">{data?.stats?.usersWithFines || 0}</h4>
               </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-white/5">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Top Overdue Books</h4>
               <div className="space-y-3">
                  {data?.topOverdue?.map((o, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex flex-col">
                          <span className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">{i+1}. {o.book}</span>
                          <span className="text-[9px] font-medium text-slate-500">Overdue by {o.days} days</span>
                       </div>
                       <span className="text-[9px] font-black text-white uppercase tracking-widest">{o.userId}</span>
                    </div>
                  ))}
                  {(!data?.topOverdue || data.topOverdue.length === 0) && (
                     <div className="text-center py-4 text-slate-600 text-[10px] font-bold uppercase">No Overdue Items</div>
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibrarianOverview;
