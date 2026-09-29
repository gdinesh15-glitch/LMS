import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, Search, Pencil, Trash2, X, Check, Users,
  Shield, GraduationCap, Library, ChevronRight, AlertCircle,
  CheckCircle, RefreshCw, Filter, Save, SlidersHorizontal
} from 'lucide-react';
import userService from '../../api/services/userService';

/* ── Toast ─────────────────────────────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = type === 'success'
    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
    : 'bg-rose-500/20 border-rose-500/40 text-rose-300';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-sm font-semibold ${c}`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{msg}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
};

/* ── Badge colors by prefix ────────────────────────────────────────────── */
const badgeStyle = (id = '') => {
  const u = id.toUpperCase();
  if (u.startsWith('LIB')) return 'bg-blue-600/20 text-blue-400 border border-blue-500/30';
  if (u.startsWith('FAC')) return 'bg-violet-600/20 text-violet-400 border border-violet-500/30';
  if (u.startsWith('STU')) return 'bg-teal-600/20 text-teal-400 border border-teal-500/30';
  return 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30';
};

const ROLES = ['Student', 'Faculty', 'Librarian'];
const TABS = [
  { key: 'all', label: 'All Directory' },
  { key: 'librarian', label: 'Librarians' },
  { key: 'faculty', label: 'Faculty' },
  { key: 'student', label: 'Students' },
];
const PAGE_SIZE = 10;
const RoleIcon = { librarian: Library, faculty: GraduationCap, student: Users };

/* ── Input Field ───────────────────────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.8)' }}>{label}</label>
    {children}
  </div>
);
const inp = "w-full px-4 h-11 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/50 placeholder:text-slate-600";
const inpStyle = { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.8)', color: '#e2e8f0' };

/* ══ Main Component ════════════════════════════════════════════════════════ */
const UserManagement = ({ defaultRole }) => {
  const [users, setUsers]       = useState([]);
  const [filter, setFilter]     = useState('all');
  const [search, setSearch]     = useState('');
  const [showForm, setShowForm] = useState(!!defaultRole);
  const [formRole, setFormRole] = useState(defaultRole || 'Student');
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [page, setPage]         = useState(1);

  const notify = (msg, type = 'success') => setToast({ msg, type });

  /* Fetch */
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const r = await userService.getAllUsers();
    if (r.success) setUsers(r.data);
    else notify(r.error || 'Failed to load users', 'error');
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { if (defaultRole) { setFormRole(defaultRole.charAt(0).toUpperCase() + defaultRole.slice(1)); setShowForm(true); } }, [defaultRole]);

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.target);
    const payload = {
      userId:     fd.get('regId'),
      name:       fd.get('name'),
      email:      fd.get('email'),
      phone:      fd.get('phone'),
      department: fd.get('dept'),
      role:       formRole,
    };
    if (fd.get('pw')) payload.password = fd.get('pw');
    else if (!editUser) payload.password = 'default123';
    if (formRole === 'Student') payload.year = fd.get('year') || '1st Year';

    const r = editUser
      ? await userService.updateUser(editUser._id, payload)
      : await userService.addUser(payload);
    setSaving(false);
    if (r.success) {
      notify(`"${payload.name}" ${editUser ? 'updated' : 'created'}!`);
      fetchUsers(); setShowForm(false); setEditUser(null); e.target.reset();
    } else {
      notify(r.error || 'Operation failed', 'error');
    }
  };

  /* Delete */
  const handleDelete = async (u) => {
    if (u.userId === 'admin') return notify('Security Restriction: Primary Admin cannot be removed.', 'error');
    if (!window.confirm(`Remove "${u.name}" permanently?`)) return;
    const r = await userService.deleteUser(u._id);
    r.success ? (notify(`"${u.name}" removed.`), fetchUsers()) : notify(r.error || 'Delete failed', 'error');
  };

  /* Toggle Status */
  const handleToggle = async (u) => {
    const r = await userService.toggleUserStatus(u._id);
    r.success ? fetchUsers() : notify(r.error || 'Status update failed', 'error');
  };

  /* Edit */
  const startEdit = (u) => {
    setEditUser(u);
    setFormRole(u.role || 'Student');
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Filter + Search */
  const filtered = users.filter(u => {
    if (filter !== 'all' && u.role?.toLowerCase() !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return u.name?.toLowerCase().includes(q) || u.userId?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Card style */
  const card = { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(20px)' };

  return (
    <div className="min-h-screen w-full p-4 md:p-6 space-y-5" style={{ background: 'transparent' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Page Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1.5">Identity Directory</h1>
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
            <span>Admin Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span>Identity Management</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-indigo-400">Identity Directory</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {showForm && (
            <button onClick={() => { setShowForm(false); setEditUser(null); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5 active:scale-95"
              style={{ border: '1px solid rgba(51,65,85,0.8)', color: '#94a3b8' }}>
              <X className="w-4 h-4" /> Discard
            </button>
          )}
          <button onClick={() => { setShowForm(!showForm); setEditUser(null); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
            <UserPlus className="w-4 h-4" />
            {showForm && !editUser ? 'Cancel' : editUser ? 'Edit Mode' : 'Initialize Identity'}
          </button>
        </div>
      </div>

      {/* ── Create / Edit Form ─────────────────────────────────────────── */}
      {showForm && (
        <div className="rounded-2xl overflow-hidden" style={card}>
          {/* Form header */}
          <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(124,58,237,0.3))', border: '1px solid rgba(99,102,241,0.4)' }}>
              <Shield className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{editUser ? `Edit: ${editUser.userId || editUser.id}` : 'Create Identity Record'}</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Ensuring data integrity in central repository</p>
            </div>
          </div>

          {/* Form body */}
          <form key={editUser?._id || 'new'} onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <Field label="Registry ID">
                <input name="regId" className={inp} style={inpStyle} placeholder="e.g. STU-001"
                  defaultValue={editUser?.id || editUser?.userId || ''} readOnly={!!editUser} required />
              </Field>
              <Field label="Full Name">
                <input name="name" className={inp} style={inpStyle} placeholder="John Alexander Doe"
                  defaultValue={editUser?.name || ''} required />
              </Field>
              <Field label="Designation">
                <select name="institution" className={inp} style={inpStyle}
                  value={formRole} onChange={e => setFormRole(e.target.value)}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </Field>
              <Field label="Email ID">
                <input name="email" type="email" className={inp} style={inpStyle} placeholder="j.doe@vemu.edu"
                  defaultValue={editUser?.email || ''} required />
              </Field>
              <Field label="Phone Contact">
                <input name="phone" className={inp} style={inpStyle} placeholder="+91 98765 43210"
                  defaultValue={editUser?.phone || ''} />
              </Field>
              <Field label="Assign Access Key">
                <input name="pw" type="password" className={inp} style={inpStyle}
                  placeholder={editUser ? 'Leave blank to keep unchanged' : 'Default: default123'}
                  required={!editUser} />
              </Field>
              <Field label="Department">
                <input name="dept" className={inp} style={inpStyle} placeholder="e.g. Computer Science"
                  defaultValue={editUser?.department || ''} required />
              </Field>
              {formRole === 'Student' && (
                <Field label="Academic Year">
                  <select name="year" className={inp} style={inpStyle} defaultValue={editUser?.year || '1st Year'}>
                    {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </Field>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : editUser ? 'Commit Changes' : 'Save Identity Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Directory Table ────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={card}>
        {/* Toolbar */}
        <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
          {/* Tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {TABS.map(t => (
              <button key={t.key} onClick={() => { setFilter(t.key); setPage(1); }}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={filter === t.key
                  ? { background:'rgba(99,102,241,0.2)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.4)' }
                  : { background:'transparent', color:'rgba(148,163,184,0.7)', border:'1px solid transparent' }}>
                {t.label}
                <span className="ml-1.5 text-[10px] opacity-60">
                  ({t.key === 'all' ? users.filter(u=>u.role?.toLowerCase()!=='admin').length : users.filter(u=>u.role?.toLowerCase()===t.key).length})
                </span>
              </button>
            ))}
          </div>
          {/* Search + Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color:'rgba(148,163,184,0.5)' }} />
              <input className={`${inp} pl-9 w-52`} style={inpStyle} placeholder="Search by name or ID…"
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
            <button className="flex items-center gap-2 px-4 h-11 rounded-xl text-xs font-bold transition-all hover:bg-white/5"
              style={{ border:'1px solid rgba(51,65,85,0.8)', color:'#94a3b8' }}>
              <SlidersHorizontal className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-indigo-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="text-sm font-semibold">Loading from MongoDB…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(51,65,85,0.5)' }}>
                  {['Registry ID','Identity Name','Designation','Contact Node','Current State','Actions'].map((h,i) => (
                    <th key={i} className={`py-3.5 px-5 text-left text-[10px] font-bold uppercase tracking-widest ${i===5?'text-right':''}`}
                      style={{ color:'rgba(100,116,139,0.9)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(u => {
                  const rid = u.id || u.userId || '';
                  const roleLow = u.role?.toLowerCase() || 'student';
                  const Icon = RoleIcon[roleLow] || Shield;
                  return (
                    <tr key={u._id} className="group transition-colors"
                      style={{ borderBottom:'1px solid rgba(30,41,59,0.5)' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(99,102,241,0.04)'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                      <td className="py-4 px-5 align-middle">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${badgeStyle(rid)}`}>{rid}</span>
                      </td>
                      <td className="py-4 px-5 align-middle">
                        <span className="text-sm font-semibold text-white">{u.name}</span>
                      </td>
                      <td className="py-4 px-5 align-middle">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" style={{ color:'rgba(148,163,184,0.6)' }} />
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color:'rgba(148,163,184,0.8)' }}>{u.role}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 align-middle">
                        <div className="text-xs font-medium" style={{ color:'rgba(148,163,184,0.8)' }}>{u.email || '—'}</div>
                        <div className="text-[10px] font-bold uppercase mt-0.5" style={{ color:'rgba(100,116,139,0.7)' }}>{u.department || ''}</div>
                      </td>
                      <td className="py-4 px-5 align-middle">
                        <button onClick={() => handleToggle(u)}
                          className="flex items-center gap-2 transition-opacity hover:opacity-80">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${u.status==='Active'?'bg-emerald-400':'bg-rose-400'}`} />
                          <span className="text-[10px] font-bold uppercase tracking-wider"
                            style={{ color: u.status==='Active'?'#34d399':'#f87171' }}>{u.status}</span>
                        </button>
                      </td>
                      <td className="py-4 px-5 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => startEdit(u)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-indigo-500/20"
                            style={{ border:'1px solid rgba(51,65,85,0.6)', color:'#64748b' }}
                            title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(u)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-rose-500/20 hover:text-rose-400"
                            style={{ border:'1px solid rgba(51,65,85,0.6)', color:'#64748b' }}
                            title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Search className="w-8 h-8 mx-auto mb-3" style={{ color:'rgba(100,116,139,0.5)' }} />
                      <p className="text-sm font-semibold" style={{ color:'rgba(100,116,139,0.7)' }}>
                        {search || filter!=='all' ? 'No records match your criteria.' : 'No identities registered yet.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderTop:'1px solid rgba(51,65,85,0.5)' }}>
            <span className="text-xs" style={{ color:'rgba(100,116,139,0.8)' }}>
              Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)} to {Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button disabled={page===1} onClick={()=>setPage(p=>p-1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ border:'1px solid rgba(51,65,85,0.6)', color:'#64748b' }}>‹</button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                <button key={n} onClick={()=>setPage(n)}
                  className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                  style={n===page
                    ? { background:'rgba(99,102,241,0.25)', color:'#818cf8', border:'1px solid rgba(99,102,241,0.5)' }
                    : { border:'1px solid rgba(51,65,85,0.6)', color:'#64748b' }}>{n}</button>
              ))}
              <button disabled={page===totalPages} onClick={()=>setPage(p=>p+1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ border:'1px solid rgba(51,65,85,0.6)', color:'#64748b' }}>›</button>
            </div>
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
};

export default UserManagement;
