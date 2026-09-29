import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Search, Plus, X, Pencil, Trash2, Save,
  ChevronRight, RefreshCw, Database, Layers, Flame, CheckCircle,
  AlertCircle, SlidersHorizontal, BookCopy
} from 'lucide-react';
import bookService from '../../api/services/bookService';

/* ── Toast ─────────────────────────────────────────────────────── */
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  const c = type === 'success' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-rose-500/20 border-rose-500/40 text-rose-300';
  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-sm font-semibold ${c}`}>
      <Icon className="w-4 h-4 flex-shrink-0" /><span>{msg}</span>
      <button onClick={onClose} className="ml-1 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
};

/* ── Helpers ───────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Software Engineering', 'Java', 'Python', 'Data Structures', 'Web Development', 'Databases', 'Operating Systems', 'Networking', 'AI/ML', 'General'];
const PAGE_SIZE = 10;
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.8)' }}>{label}</label>
    {children}
  </div>
);
const inp = "w-full px-4 h-11 rounded-xl text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-indigo-500/60 placeholder:text-slate-600";
const inpStyle = { background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(51,65,85,0.8)', color: '#e2e8f0' };
const card = { background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(51,65,85,0.6)', backdropFilter: 'blur(20px)' };

const statusBadge = (s) => {
  if (s === 'Available') return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  if (s === 'Low Stock') return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
};

/* ══ Books Component ═══════════════════════════════════════════════ */
const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);

  const notify = (msg, type = 'success') => setToast({ msg, type });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const r = await bookService.getAllBooks();
    if (r.success) setBooks(r.data);
    else notify(r.error || 'Failed to load books', 'error');
    setLoading(false);
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  /* Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.target);
    const payload = {
      title: fd.get('title'),
      author: fd.get('author'),
      category: fd.get('category'),
      isbn: fd.get('isbn'),
      publisher: fd.get('publisher'),
      totalCopies: parseInt(fd.get('totalCopies') || '1'),
      availableCopies: parseInt(fd.get('availableCopies') || '1'),
      shelfLocation: fd.get('shelf') || 'TBD',
    };

    const r = editBook
      ? await bookService.updateBook(editBook._id, payload)
      : await bookService.addBook(payload);
    setSaving(false);
    if (r.success) {
      notify(`"${payload.title}" ${editBook ? 'updated' : 'registered'}!`);
      fetchBooks(); setShowForm(false); setEditBook(null);
    } else notify(r.error || 'Operation failed', 'error');
  };

  /* Delete */
  const handleDelete = async (b) => {
    if (!window.confirm(`Remove "${b.title}" permanently?`)) return;
    const r = await bookService.deleteBook(b._id);
    r.success ? (notify(`"${b.title}" removed.`), fetchBooks()) : notify(r.error || 'Delete failed', 'error');
  };

  /* Edit */
  const startEdit = (b) => {
    setEditBook(b); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Filter + Search */
  const filtered = books.filter(b => {
    if (catFilter !== 'All' && b.category !== catFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q) || b.assetId?.toLowerCase().includes(q) || b.isbn?.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* Stats */
  const totalVolume = books.reduce((s, b) => s + (b.totalCopies || 0), 0);
  const totalAvailable = books.reduce((s, b) => s + (b.availableCopies || 0), 0);
  const catCounts = {};
  books.forEach(b => { catCounts[b.category] = (catCounts[b.category] || 0) + 1; });
  const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  return (
    <div className="min-h-screen w-full p-4 md:p-6 space-y-5" style={{ background: 'transparent' }}>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white mb-1.5">Asset Repository</h1>
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'rgba(148,163,184,0.7)' }}>
            <span>Admin Dashboard</span><ChevronRight className="w-3 h-3" />
            <span>Library</span><ChevronRight className="w-3 h-3" />
            <span className="text-indigo-400">Asset Repository</span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button onClick={fetchBooks}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(51,65,85,0.8)', color: '#94a3b8' }}>
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button onClick={() => { setShowForm(!showForm); setEditBook(null); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95 shadow-lg"
            style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.35)' }}>
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'Register New Asset'}
          </button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Unique Titles', val: books.length, icon: Database, color: '#818cf8', bg: 'rgba(99,102,241,0.12)' },
          { label: 'Total Asset Volume', val: totalVolume, icon: Layers, color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
          { label: 'Most Popular Category', val: topCategory, icon: Flame, color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
          { label: 'Available Copies', val: totalAvailable, icon: BookCopy, color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-5 flex items-center gap-4" style={card}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.8)' }}>{s.label}</p>
              <p className="text-xl font-black text-white mt-0.5">{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Form ─────────────────────────────────────────────────── */}
      {showForm && (
        <div className="rounded-2xl overflow-hidden" style={card}>
          <div className="px-6 py-5 flex items-center gap-4" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(124,58,237,0.3))', border: '1px solid rgba(99,102,241,0.4)' }}>
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{editBook ? `Edit: ${editBook.assetId || editBook.title}` : 'Register New Asset'}</h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Add or modify book inventory records</p>
            </div>
          </div>
          <form key={editBook?._id || 'new'} onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <Field label="Book Title *"><input name="title" className={inp} style={inpStyle} placeholder="e.g. Clean Code" defaultValue={editBook?.title || ''} required /></Field>
              <Field label="Author *"><input name="author" className={inp} style={inpStyle} placeholder="e.g. Robert C. Martin" defaultValue={editBook?.author || ''} required /></Field>
              <Field label="Category">
                <select name="category" className={inp} style={inpStyle} defaultValue={editBook?.category || 'General'}>
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="ISBN"><input name="isbn" className={inp} style={inpStyle} placeholder="978-XXXXXXXXXX" defaultValue={editBook?.isbn || ''} /></Field>
              <Field label="Publisher"><input name="publisher" className={inp} style={inpStyle} placeholder="e.g. Pearson" defaultValue={editBook?.publisher || ''} /></Field>
              <Field label="Total Copies"><input name="totalCopies" type="number" min="1" className={inp} style={inpStyle} defaultValue={editBook?.totalCopies || 1} /></Field>
              <Field label="Available Copies"><input name="availableCopies" type="number" min="0" className={inp} style={inpStyle} defaultValue={editBook?.availableCopies || 1} /></Field>
              <Field label="Shelf Location"><input name="shelf" className={inp} style={inpStyle} placeholder="e.g. A-01" defaultValue={editBook?.shelfLocation || ''} /></Field>
            </div>
            <div className="flex justify-end mt-6">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : editBook ? 'Update Asset' : 'Save Asset'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Table Card ────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden" style={card}>
        {/* Toolbar */}
        <div className="px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
          <div className="flex items-center gap-1 flex-wrap">
            {CATEGORIES.slice(0, 6).map(c => (
              <button key={c} onClick={() => { setCatFilter(c); setPage(1); }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
                style={catFilter === c
                  ? { background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.4)' }
                  : { background: 'transparent', color: 'rgba(148,163,184,0.7)', border: '1px solid transparent' }}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(148,163,184,0.5)' }} />
              <input className={`${inp} pl-9 w-52`} style={inpStyle} placeholder="Search title, author…"
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24 gap-3 text-indigo-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="text-sm font-semibold">Loading books…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
                  {['Asset ID', 'Book Title', 'Author', 'Category', 'ISBN', 'Avail / Total', 'Status', 'Actions'].map((h, i) => (
                    <th key={i} className={`py-3.5 px-5 text-left text-[10px] font-bold uppercase tracking-widest ${i === 7 ? 'text-right' : ''}`}
                      style={{ color: 'rgba(100,116,139,0.9)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(b => (
                  <tr key={b._id} className="transition-colors"
                    style={{ borderBottom: '1px solid rgba(30,41,59,0.5)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="py-4 px-5 align-middle">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">{b.assetId || '—'}</span>
                    </td>
                    <td className="py-4 px-5 align-middle"><span className="text-sm font-semibold text-white">{b.title}</span></td>
                    <td className="py-4 px-5 align-middle text-xs font-medium" style={{ color: 'rgba(148,163,184,0.8)' }}>{b.author}</td>
                    <td className="py-4 px-5 align-middle"><span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(148,163,184,0.6)' }}>{b.category}</span></td>
                    <td className="py-4 px-5 align-middle text-xs" style={{ color: 'rgba(100,116,139,0.7)' }}>{b.isbn || '—'}</td>
                    <td className="py-4 px-5 align-middle text-xs font-bold">
                      <span style={{ color: b.availableCopies > 0 ? '#34d399' : '#f87171' }}>{b.availableCopies}</span>
                      <span style={{ color: 'rgba(100,116,139,0.6)' }}> / {b.totalCopies}</span>
                    </td>
                    <td className="py-4 px-5 align-middle">
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${statusBadge(b.status)}`}>{b.status}</span>
                    </td>
                    <td className="py-4 px-5 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(b)} title="Edit"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-indigo-500/20"
                          style={{ border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }}><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(b)} title="Delete"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-rose-500/20 hover:text-rose-400"
                          style={{ border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }}><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-20 text-center">
                      <Search className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgba(100,116,139,0.5)' }} />
                      <p className="text-sm font-semibold" style={{ color: 'rgba(100,116,139,0.7)' }}>No books match your criteria.</p>
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
            style={{ borderTop: '1px solid rgba(51,65,85,0.5)' }}>
            <span className="text-xs" style={{ color: 'rgba(100,116,139,0.8)' }}>
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-1.5">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className="w-8 h-8 rounded-lg text-xs font-bold transition-all"
                  style={n === page
                    ? { background: 'rgba(99,102,241,0.25)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.5)' }
                    : { border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }}>{n}</button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-30"
                style={{ border: '1px solid rgba(51,65,85,0.6)', color: '#64748b' }}>›</button>
            </div>
          </div>
        )}
      </div>

      <div className="h-6" />
    </div>
  );
};

export default Books;
