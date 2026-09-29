import React, { useState, useEffect } from 'react';
import { DB, genId, addActivity } from '../../utils/db';
import { Plus, X, Layers, BookOpen, GraduationCap, Calendar, Database } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const CourseReserves = () => {
  const [reserves, setReserves] = useState([]);
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const userId = 'FAC001';

  const reload = () => {
    const all = DB.get('course_reserves') || [];
    setReserves(all.filter(r => r.facultyId === userId));
    setBooks(DB.get('books') || []);
  };
  useEffect(reload, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const bookId = fd.get('bookId');
    const book = books.find(b => b.id === bookId);
    if (!book) { alert('Record Mismatch: Provided Book ID not found in catalog.'); return; }
    const nr = { id: genId('CR'), facultyId: userId, bookId, bookTitle: book.title, courseName: fd.get('courseName'), semester: fd.get('semester'), status: 'Active', date: new Date().toISOString().split('T')[0] };
    const all = DB.get('course_reserves') || [];
    DB.set('course_reserves', [...all, nr]);
    const ub = books.map(b => b.id === bookId ? { ...b, is_course_reserve: true } : b);
    DB.set('books', ub);
    addActivity('fa-book-reader', '#a78bfa', `Course Reserve: "${book.title}"`, 'rgba(167,139,250,.12)');
    setShowForm(false); reload();
    alert(`✅ Academic Lock: "${book.title}" reserved for ${nr.courseName}.`);
  };

  const deleteReserve = (id) => {
    if (!window.confirm('Decommission this academic reserve?')) return;
    const all = DB.get('course_reserves') || [];
    DB.set('course_reserves', all.filter(r => r.id !== id));
    reload();
  };

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Curriculum Reserves</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">High-priority asset allocation for academic courses</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Abort Protocol' : 'New Strategic Reserve'}
        </Button>
      </div>

      {showForm && (
        <Card className="border-t-4 border-t-indigo-500 shadow-2xl">
          <div className="flex items-center space-x-4 mb-10 border-b border-[var(--border-color)] pb-8">
            <div className="h-14 w-14 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-indigo-500 shadow-inner">
               <Layers className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-xl font-black tracking-tight uppercase text-[var(--text-primary)]">Initialize Reserve Entry</h3>
               <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Marking assets for curriculum-specific student access</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Input label="Asset ID (Book ID)" name="bookId" required placeholder="e.g. BK-2026-###" icon={BookOpen} />
              <Input label="Academic Module (Course)" name="courseName" required placeholder="e.g. AI-601" icon={GraduationCap} />
              <Input label="Temporal Node (Semester)" name="semester" required placeholder="e.g. FALL 2026" icon={Calendar} />
            </div>
            <div className="flex justify-end space-x-4 pt-8 border-t border-[var(--border-color)]">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Discard</Button>
              <Button type="submit" className="px-10">Commit Reserve</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 border-none overflow-hidden shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry ID</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Intellectual Asset</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Academic Target</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Schedule</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">State</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {reserves.map(r => (
                <tr key={r.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-5 px-8 whitespace-nowrap">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                       {r.id}
                    </span>
                  </td>
                  <td className="py-5 px-8 font-black text-sm text-[var(--text-primary)] uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                    {r.bookTitle}
                  </td>
                  <td className="py-5 px-8 font-bold text-xs text-[var(--text-secondary)] italic">
                    {r.courseName}
                  </td>
                  <td className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase">{r.semester}</td>
                  <td className="py-5 px-8">
                    <Badge type="available">{r.status.toUpperCase()}</Badge>
                  </td>
                  <td className="py-5 px-8">
                    <Button 
                      variant="ghost" 
                      className="py-1.5 h-auto text-[9px] px-3 border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:border-rose-900/20 dark:hover:bg-rose-950/40"
                      onClick={() => deleteReserve(r.id)}
                    >
                      Release
                    </Button>
                  </td>
                </tr>
              ))}
              {reserves.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <Database className="h-8 w-8" />
                      </div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Registry Vacuum</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">No pedagogical reserves established for this session</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CourseReserves;
