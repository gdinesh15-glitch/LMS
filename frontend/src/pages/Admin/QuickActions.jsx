import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, BookPlus, ClipboardList, ShieldAlert, 
  Settings, Database, Handshake, Globe, 
  Terminal, ShieldCheck, Zap, Activity, 
  Clock, BarChart3, ChevronRight, Server, CheckCircle2, AlertCircle, TrendingUp
} from 'lucide-react';

const QuickActionCard = ({ icon: Icon, title, desc, onClick, color }) => (
  <div 
    className="group cursor-pointer rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--accent-base)] transition-all duration-300 hover:shadow-2xl hover:shadow-[var(--accent-base)]/10 hover:-translate-y-2 relative overflow-hidden flex flex-col min-h-[220px]"
    onClick={onClick}
  >
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ 
        background: `radial-gradient(circle at top right, ${color}15, transparent 70%)`
      }}
    ></div>
    
    <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-500 rounded-l-full" style={{ backgroundColor: color }}></div>

    <div className="flex flex-col items-start relative z-10 flex-1 p-6 lg:p-8">
      <div className="flex justify-between w-full items-start mb-6">
        <div className={`p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 shadow-sm`} style={{ backgroundColor: `${color}15`, color: color }}>
          <Icon className="w-8 h-8" strokeWidth={2} />
        </div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 bg-[var(--bg-secondary)]" style={{ color: color }}>
          <ChevronRight className="w-5 h-5" strokeWidth={3} />
        </div>
      </div>
      <div className="mt-auto w-full">
        <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-base)] transition-colors">{title}</h3>
        <p className="text-sm font-medium text-[var(--text-muted)] mt-2 leading-relaxed">{desc}</p>
      </div>
    </div>
  </div>
);

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { title: 'Initialize Librarian', desc: 'Provision a new administrative account with limited clearance', icon: ShieldCheck, color: '#6366f1', to: '/admin/add-librarian' },
    { title: 'Catalog New Asset', desc: 'Register a new physical or digital book into the institutional registry', icon: BookPlus, color: '#ec4899', to: '/admin/books' },
    { title: 'Identity Audit', desc: 'Review all authorized personnel and manage access states', icon: UserPlus, color: '#10b981', to: '/admin/users' },
    { title: 'System Protocols', desc: 'Modify global library constants and access rules', icon: Terminal, color: '#f59e0b', to: '/admin/config' },
    { title: 'Philanthropic Ledger', desc: 'Manage external book contributions and community donations', icon: Handshake, color: '#8b5cf6', to: '/admin/donations' },
    { title: 'Data Integrity', desc: 'View comprehensive system audit logs and event history', icon: ClipboardList, color: '#06b6d4', to: '/admin/audit' },
    { title: 'Security Sentinel', desc: 'Configure advanced multi-factor and firewall protocols', icon: ShieldAlert, color: '#ef4444', to: '/admin/settings' },
    { title: 'Global Outreach', desc: 'Manage inter-institutional sharing and external APIs', icon: Globe, color: '#3b82f6', to: '/admin/settings' }
  ];

  return (
    <div className="flex flex-col h-full w-full space-y-8 animate-in opacity-0" style={{ animationDuration: '0.6s' }}>
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[var(--bg-card)] p-8 rounded-3xl border border-[var(--border-color)] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[var(--accent-base)] to-transparent opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:opacity-10 transition-opacity duration-700"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-muted)] mb-3 uppercase tracking-wider">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4 text-[var(--border-color)]" />
            <span className="text-[var(--accent-base)] flex items-center gap-2">
               <Zap className="w-4 h-4 fill-current" /> Command Center
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)]">Quick Actions</h1>
          <p className="text-base font-medium text-[var(--text-muted)] mt-2">Accelerated administrative protocols and quick-access utilities for the institution.</p>
        </div>
        <div className="flex flex-wrap gap-3 relative z-10">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-base)] transition-all text-sm font-bold hover:shadow-lg hover:-translate-y-0.5">
            <Clock className="w-5 h-5 text-[var(--text-muted)]" />
            <span>Activity Log</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--accent-base)] text-white shadow-lg shadow-[var(--accent-base)]/30 hover:shadow-[var(--accent-base)]/50 transition-all text-sm font-bold active:scale-95 hover:-translate-y-0.5">
            <Activity className="w-5 h-5" />
            <span>Live Monitoring</span>
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {actions.map((action, idx) => (
          <QuickActionCard key={idx} {...action} onClick={() => navigate(action.to)} />
        ))}
      </div>

      {/* Lower Dashboard Section: Grid layout for lower stats/panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-2 pb-8">
        
        {/* System Status Panel */}
        <div className="col-span-1 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 flex flex-col shadow-sm hover:border-[var(--accent-base)]/50 transition-colors duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
               <Activity className="w-5 h-5 text-[var(--accent-base)]" />
               System Status
            </h3>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Operational
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500"><Server className="w-5 h-5" /></div>
                <span className="text-sm font-bold text-[var(--text-primary)]">Main Server</span>
              </div>
              <span className="text-xs font-black text-emerald-500">99.9% Uptime</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500"><Database className="w-5 h-5" /></div>
                <span className="text-sm font-bold text-[var(--text-primary)]">Database Sync</span>
              </div>
              <span className="text-xs font-black text-emerald-500">Synced 1m ago</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-secondary)] border border-transparent hover:border-[var(--border-color)] transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500"><AlertCircle className="w-5 h-5" /></div>
                <span className="text-sm font-bold text-[var(--text-primary)]">Security Firewall</span>
              </div>
              <span className="text-xs font-black text-emerald-500">Active</span>
            </div>
          </div>
        </div>

        {/* Analytics Summary */}
        <div className="col-span-1 lg:col-span-2 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 flex flex-col relative overflow-hidden group shadow-sm hover:border-[var(--accent-base)]/50 transition-colors duration-300">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[var(--accent-base)] to-transparent opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:opacity-10 transition-opacity duration-700"></div>
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
               <BarChart3 className="w-5 h-5 text-[var(--accent-base)]" />
               Analytics Overview
            </h3>
            <button className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent-base)] transition-colors flex items-center gap-1 uppercase tracking-wider">
              View Full Report <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-base)]/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Total Users</p>
              <div className="flex flex-col gap-1">
                <h4 className="text-3xl font-black text-[var(--text-primary)]">1,248</h4>
                <span className="text-xs font-bold text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +12% this month</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-base)]/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Library Assets</p>
              <div className="flex flex-col gap-1">
                <h4 className="text-3xl font-black text-[var(--text-primary)]">8,432</h4>
                <span className="text-xs font-bold text-emerald-500 flex items-center"><TrendingUp className="w-3 h-3 mr-1" /> +5% this week</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-base)]/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Active Loans</p>
              <div className="flex flex-col gap-1">
                <h4 className="text-3xl font-black text-[var(--text-primary)]">342</h4>
                <span className="text-xs font-bold text-amber-500 flex items-center">Stable usage</span>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-base)]/50 transition-all hover:shadow-lg hover:-translate-y-1">
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">System Load</p>
              <div className="flex flex-col gap-1">
                <h4 className="text-3xl font-black text-[var(--text-primary)]">24%</h4>
                <span className="text-xs font-bold text-emerald-500 flex items-center">Healthy</span>
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-indigo-500/5 border border-dashed border-indigo-500/20 hover:border-indigo-500/40 transition-colors flex flex-col sm:flex-row items-center justify-between relative z-10 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-base)] text-white shadow-lg shadow-[var(--accent-base)]/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-base font-bold text-[var(--text-primary)]">Institutional Intelligence Active</h5>
                <p className="text-sm font-medium text-[var(--text-muted)] mt-1">All actions are securely logged in the immutable audit trail.</p>
              </div>
            </div>
            <button onClick={() => navigate('/admin/audit')} className="px-5 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all whitespace-nowrap">
              View Audit Log
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuickActions;
