import React, { useState, useEffect } from 'react';
import { DB, genId, addActivity } from '../../utils/db';
import { Plus, X, ArrowLeftRight, Trash2, BookOpen, Building2, MessageSquare, Database, User } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const ILLRequests = () => {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const userId = 'FAC001';

  const reload = () => {
    const all = DB.get('ill_requests') || [];
    setRequests(all.filter(p => p.facultyId === userId));
  };
  useEffect(reload, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const nr = { id: genId('ILL'), facultyId: userId, title: fd.get('title'), author: fd.get('author'), institution: fd.get('institution'), notes: fd.get('notes'), status: 'Pending', date: new Date().toISOString().split('T')[0] };
    const all = DB.get('ill_requests') || [];
    DB.set('ill_requests', [...all, nr]);
    addActivity('fa-exchange-alt', '#38bdf8', `New ILL: "${nr.title}"`, 'rgba(56,189,248,.12)');
    setShowForm(false); reload();
    alert(`✅ Global Index Sync: ILL request for "${nr.title}" submitted!`);
  };

  const deleteRequest = (id) => {
    if (!window.confirm('Decommission this Inter-Library request?')) return;
    const all = DB.get('ill_requests') || [];
    DB.set('ill_requests', all.filter(r => r.id !== id));
    reload();
  };

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Inter-Library Exchange</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Cross-institutional resource sharing & acquisition</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Abort Request' : 'Initialize Exchange'}
        </Button>
      </div>

      {showForm && (
        <Card className="border-t-4 border-t-sky-500 shadow-2xl">
          <div className="flex items-center space-x-4 mb-10 border-b border-[var(--border-color)] pb-8">
            <div className="h-14 w-14 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-sky-500 shadow-inner">
               <ArrowLeftRight className="w-6 h-6" />
            </div>
            <div>
               <h3 className="text-xl font-black tracking-tight uppercase text-[var(--text-primary)]">ILL Protocol Initialization</h3>
               <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Requesting intellectual volumes from external academic nodes</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Volume Title" name="title" required placeholder="e.g. Theoretical Physics Journals" icon={BookOpen} />
              <Input label="Primary Author" name="author" required placeholder="Full Name" icon={User} />
              <Input label="Source Node (Institution)" name="institution" placeholder="e.g. Stanford University Library" icon={Building2} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" /> Specification Notes
                </label>
                <textarea 
                  name="notes" 
                  placeholder="Volume year, edition, or specific archive reference..." 
                  className="pro-input min-h-[80px] bg-transparent resize-none py-4"
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-8 border-t border-[var(--border-color)]">
              <Button variant="ghost" type="button" onClick={() => setShowForm(false)}>Discard</Button>
              <Button type="submit" className="px-12 bg-sky-600 hover:bg-sky-500 shadow-sky-600/10">Execute Exchange Request</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-0 border-none overflow-hidden shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans text-sm">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry ID</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Specification</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Primary Creator</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current State</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timeline</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {requests.map(r => (
                <tr key={r.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                  <td className="py-5 px-8 whitespace-nowrap">
                    <span className="text-[10px] font-black text-sky-600 bg-sky-50 dark:bg-sky-950/30 px-3 py-1.5 rounded-lg border border-sky-100 dark:border-sky-900/30">
                       {r.id}
                    </span>
                  </td>
                  <td className="py-5 px-8 font-black text-sm text-[var(--text-primary)] uppercase tracking-tight group-hover:text-sky-600 transition-colors">
                    {r.title}
                  </td>
                  <td className="py-5 px-8 font-bold text-xs text-[var(--text-secondary)]">
                    {r.author}
                  </td>
                  <td className="py-5 px-8">
                    <Badge type={r.status === 'Received' ? 'available' : r.status === 'Denied' ? 'overdue' : 'primary'}>
                      {r.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-5 px-8 text-xs font-bold text-slate-500 whitespace-nowrap">
                    {r.date}
                  </td>
                  <td className="py-5 px-8">
                    {r.status === 'Pending' && (
                      <button 
                        onClick={() => deleteRequest(r.id)} 
                        className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all dark:bg-rose-950/30 dark:hover:bg-rose-600 shadow-sm"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-4">
                        <ArrowLeftRight className="h-8 w-8" />
                      </div>
                      <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Zero Exchanges</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">No active inter-institutional requests found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-950 border-none p-10 relative overflow-hidden text-white shadow-2xl">
          <div className="absolute top-0 right-0 p-10 opacity-5">
             <Building2 className="w-40 h-40" />
          </div>
          <h4 className="text-xl font-black uppercase tracking-tight mb-4 relative z-10">Global Archive Network</h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed relative z-10">
            ILL facilitates the sharing of knowledge beyond the physical constraints of VEMU. By connecting to larger academic consortiums, we ensure faculty have access to essential data from around the globe.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ILLRequests;
