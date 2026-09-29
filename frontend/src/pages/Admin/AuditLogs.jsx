import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Trash2, RefreshCw, ChevronRight, CheckCircle, AlertCircle,
  X, Database, Activity, Clock, Shield, BookOpen, Users, LogIn,
  Download, SlidersHorizontal, XCircle
} from 'lucide-react';
import activityLogService from '../../api/services/activityLogService';

/* ── Toast ─────────────────────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300';
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-sm font-semibold ${c}`}>
      {type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
};

/* ── Helpers ───────────────────────────────────────────────────── */
const timeAgo = (ts) => {
  if (!ts) return '';
  const d = Date.now() - new Date(ts).getTime();
  const m = Math.floor(d / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const fmtDate = (ts) => {
  if (!ts) return '';
  return new Date(ts).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
};

const actionMeta = {
  USER_LOGIN:  { icon: LogIn, color: '#3b82f6', label: 'Login' },
  USER_LOGOUT: { icon: LogIn, color: '#64748b', label: 'Logout' },
  USER_CREATE: { icon: Users, color: '#10b981', label: 'User Created' },
  USER_UPDATE: { icon: Users, color: '#8b5cf6', label: 'User Updated' },
  USER_DELETE: { icon: XCircle, color: '#ef4444', label: 'User Deleted' },
  USER_STATUS: { icon: Shield, color: '#f59e0b', label: 'Status Changed' },
  BOOK_CREATE: { icon: BookOpen, color: '#06b6d4', label: 'Book Added' },
  BOOK_UPDATE: { icon: BookOpen, color: '#8b5cf6', label: 'Book Updated' },
  BOOK_DELETE: { icon: XCircle, color: '#ef4444', label: 'Book Deleted' },
  BOOK_ISSUE:  { icon: BookOpen, color: '#f59e0b', label: 'Book Issued' },
  BOOK_RETURN: { icon: BookOpen, color: '#10b981', label: 'Book Returned' },
  SYSTEM_SEED: { icon: Database, color: '#64748b', label: 'System Seed' },
};
const defaultMeta = { icon: Activity, color: '#64748b', label: 'Action' };

const statusBadge = (s) => {
  if (s === 'success') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (s === 'failed') return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
};

const MODULES = ['All', 'Auth', 'Users', 'Books', 'Transactions', 'Settings', 'System'];
const card = { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(20px)' };
const PAGE_SIZE = 15;

/* ══ AuditLogs Component ═══════════════════════════════════════ */
const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ totalLogs: 0, todayLogs: 0, successLogs: 0, failedLogs: 0 });
  const [search, setSearch] = useState('');
  const [modFilter, setModFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);

  const notify = (msg, type = 'success') => setToast({ msg, type });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (modFilter !== 'All') params.module = modFilter;
    if (search) params.search = search;
    params.limit = 200;

    const r = await activityLogService.getLogs(params);
    if (r.success) {
      setLogs(r.data.logs || []);
      setStats(r.data.stats || {});
    } else {
      notify(r.error || 'Failed to load logs', 'error');
    }
    setLoading(false);
  }, [modFilter, search]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleClear = async () => {
    if (!window.confirm('Permanently clear ALL activity logs?')) return;
    const r = await activityLogService.clearLogs();
    r.success ? (notify('All logs cleared.'), fetchLogs()) : notify(r.error, 'error');
  };

  const handleExport = () => {
    const csv = ['Time,Action,Module,User,Role,Target,Status,Message']
      .concat(logs.map(l => `"${fmtDate(l.createdAt)}","${l.actionType}","${l.module}","${l.performedBy}","${l.role}","${l.targetName}","${l.status}","${l.message}"`))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `activity-logs-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    notify('CSV exported!');
  };

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const paginated = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statCards = [
    { label: 'Total Logs', val: stats.totalLogs, icon: Database, color: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
    { label: 'Today', val: stats.todayLogs, icon: Clock, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Successful', val: stats.successLogs, icon: CheckCircle, color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Failed', val: stats.failedLogs, icon: AlertCircle, color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  ];

  return (
    <div className="min-h-screen w-full p-4 md:p-6 space-y-5" style={{ background: 'transparent' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1.5">Activity Log</h1>
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
            <span>Admin Dashboard</span><ChevronRight className="w-3 h-3" />
            <span>Reports</span><ChevronRight className="w-3 h-3" />
            <span className="text-indigo-400">Activity Log</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <button onClick={fetchLogs} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/5" style={{ border: '1px solid rgba(51,65,85,0.8)', color: '#94a3b8' }}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/5" style={{ border: '1px solid rgba(51,65,85,0.8)', color: '#94a3b8' }}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={handleClear} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-rose-500/10 hover:text-rose-400" style={{ border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="rounded-2xl p-5 flex items-center gap-4" style={card}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.8)' }}>{s.label}</p>
              <p className="text-2xl font-black text-white mt-0.5">{loading ? '—' : s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="rounded-2xl overflow-hidden" style={card}>
        {/* Toolbar */}
        <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
          <div className="flex items-center gap-1 flex-wrap">
            {MODULES.map(m => (
              <button key={m} onClick={() => { setModFilter(m); setPage(1); }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                style={modFilter === m
                  ? { background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.4)' }
                  : { background: 'transparent', color: 'rgba(148,163,184,0.7)', border: '1px solid transparent' }}>
                {m}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(148,163,184,0.5)' }} />
            <input
              className="w-full md:w-56 pl-9 pr-4 h-10 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/60 placeholder:text-slate-600"
              style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.8)', color: '#e2e8f0' }}
              placeholder="Search logs…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        {/* Logs */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-indigo-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="text-sm font-semibold">Loading activity logs…</span>
          </div>
        ) : paginated.length === 0 ? (
          <div className="py-24 text-center">
            <Database className="w-10 h-10 mx-auto mb-4" style={{ color: 'rgba(100,116,139,0.4)' }} />
            <p className="text-sm font-bold" style={{ color: 'rgba(100,116,139,0.6)' }}>No activity logs found</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(100,116,139,0.4)' }}>Perform actions in the app and they will appear here automatically.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(30,41,59,0.5)' }}>
            {paginated.map((l) => {
              const meta = actionMeta[l.actionType] || defaultMeta;
              const Icon = meta.icon;
              return (
                <div key={l._id} className="px-5 py-4 flex items-start gap-4 transition-colors"
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: meta.color }} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{l.message}</span>
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${statusBadge(l.status)}`}>{l.status}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>{meta.label}</span>
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(100,116,139,0.7)' }}>•</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.6)' }}>{l.module}</span>
                      <span className="text-[10px] font-medium" style={{ color: 'rgba(100,116,139,0.7)' }}>•</span>
                      <span className="text-[10px] font-semibold" style={{ color: 'rgba(148,163,184,0.5)' }}>by {l.performedBy} ({l.role})</span>
                      {l.targetName && (
                        <>
                          <span className="text-[10px] font-medium" style={{ color: 'rgba(100,116,139,0.7)' }}>•</span>
                          <span className="text-[10px] font-semibold" style={{ color: 'rgba(148,163,184,0.5)' }}>→ {l.targetName}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Timestamp */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-[10px] font-bold" style={{ color: 'rgba(148,163,184,0.6)' }}>{timeAgo(l.createdAt)}</div>
                    <div className="text-[9px] font-medium mt-0.5" style={{ color: 'rgba(100,116,139,0.5)' }}>{fmtDate(l.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && logs.length > PAGE_SIZE && (
          <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(51,65,85,0.5)' }}>
            <span className="text-xs" style={{ color: 'rgba(100,116,139,0.8)' }}>
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, logs.length)}–{Math.min(page * PAGE_SIZE, logs.length)} of {logs.length}
            </span>
            <div className="flex items-center gap-1.5">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30" style={{ border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map(n => (
                <button key={n} onClick={() => setPage(n)} className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                  style={n === page ? { background: 'rgba(99,102,241,0.25)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.5)' } : { border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }}>{n}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30" style={{ border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }}>›</button>
            </div>
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
};

export default AuditLogs;
