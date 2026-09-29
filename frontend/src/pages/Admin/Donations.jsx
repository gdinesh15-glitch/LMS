import React, { useState, useEffect } from 'react';
import { DB, genId, addActivity } from '../../utils/db';
import { 
  Heart, CheckCircle, Clock, Trash2, 
  Search, Filter, Plus, X, HandHeart
} from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const Donations = () => {
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { 
    setDonations(DB.get('donations') || []); 
  }, []);

  const handleRecordDonation = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const title = fd.get('title');
    const newDonation = {
      donId: genId('DON'),
      studentName: fd.get('studentName'),
      studentId: fd.get('studentId'),
      title,
      author: fd.get('author'),
      category: fd.get('category'),
      copies: parseInt(fd.get('copies') || '1'),
      status: 'approved',
      date: new Date().toISOString().split('T')[0],
      ts: Date.now()
    };

    const updated = [newDonation, ...donations];
    DB.set('donations', updated);
    setDonations(updated);
    addActivity('fa-hand-holding-heart', '#f9a8d4', `Recorded donation: "${title}" by ${newDonation.studentName}`, 'rgba(249,168,212,.15)');
    
    // NOTIFICATION
    import('../../utils/db').then(({ pushNotif }) => {
      pushNotif('fa-gift', 'rgba(249,168,212,.15)', '#f9a8d4', `Philanthropic ledger updated: "${title}" contributed`, 'success');
    });

    setShowForm(false);
    alert('✅ Donation record successfully integrated.');
  };

  const approveDonation = async (id) => {
    const updated = donations.map(d => d.donId === id ? { ...d, status: 'approved' } : d);
    DB.set('donations', updated);
    setDonations(updated);
    
    const { pushNotif } = await import('../../utils/db');
    pushNotif('fa-check-circle', 'rgba(110,231,183,.15)', '#6ee7b7', `Contribution cataloged: Asset successfully reviewed`, 'success');

    alert('✅ Donation approved and cataloged.');
  };

  const deleteDonation = (id) => {
    if (!window.confirm('Erase this donation record?')) return;
    const updated = donations.filter(d => d.donId !== id);
    DB.set('donations', updated);
    setDonations(updated);
  };

  const filtered = donations.filter(d => {
    const matchesSearch = !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.studentName.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || d.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Philanthropic Ledger</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Management of book donations and contributions</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Abort Entry' : 'Manual Entry'}
        </Button>
      </div>

      {showForm && (
        <Card className="border-t-4 border-t-pink-500 shadow-2xl">
          <div className="flex items-center space-x-3 mb-8 pb-6 border-b border-[var(--border-color)]">
             <HandHeart className="h-6 w-6 text-pink-500" />
             <h4 className="text-lg font-black uppercase text-[var(--text-primary)]">Record External Contribution</h4>
          </div>
          <form onSubmit={handleRecordDonation} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <Input label="Donor Name" name="studentName" placeholder="Full name of donor" required />
               <Input label="Donor ID / Roll" name="studentId" placeholder="e.g. 21VE1..." required />
               <Input label="Book Title" name="title" required />
               <Input label="Author" name="author" required />
               <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Category</label>
                  <select className="pro-input bg-transparent" name="category">
                    {['Java','Python','AI/ML','Mathematics','Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
               </div>
               <Input label="Copies" name="copies" type="number" defaultValue="1" min="1" />
            </div>
            <div className="flex justify-end space-x-4 pt-10 border-t border-[var(--border-color)]">
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="px-12 bg-pink-600 hover:bg-pink-500 text-white border-none shadow-lg shadow-pink-500/20">Commit Donation</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Stats Mini Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-gradient-to-br from-pink-600 to-rose-600 text-white border-none shadow-lg">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Contributed</p>
            <h4 className="text-3xl font-black">{donations.length} <span className="text-sm font-bold opacity-60">Assets</span></h4>
         </Card>
         <Card className="border-l-4 border-l-amber-500">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Pending Review</p>
            <h4 className="text-3xl font-black">{donations.filter(d => d.status === 'pending').length}</h4>
         </Card>
      </div>

      {/* Directory Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'approved'].map(f => (
            <button 
              key={f} 
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-indigo-500/50'
              }`} 
              onClick={() => setFilter(f)}
            >
              {f} Entries
            </button>
          ))}
        </div>
        <div className="w-full md:w-80">
          <Input 
            icon={Search} 
            placeholder="Search donor or title..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
      </div>

      <Card className="p-0 border-none overflow-hidden shadow-xl">
        <div className="overflow-x-auto rounded-2xl border border-[var(--border-color)]">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Donation ID</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Donor Identity</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Specs</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current State</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {filtered.map(d => (
                <tr key={d.donId} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-5 px-8">
                     <span className="text-[10px] font-black text-pink-600 bg-pink-50 dark:bg-pink-900/20 px-3 py-1.5 rounded-lg">
                        {d.donId}
                     </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="font-black text-sm text-[var(--text-primary)]">{d.studentName}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{d.studentId}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-[var(--text-secondary)]">{d.title}</span>
                      <span className="text-[10px] font-medium text-slate-400 italic">Qty: {d.copies} • {d.category}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <Badge type={d.status === 'approved' ? 'available' : 'default'} className="lowercase italic">
                       {d.status}
                    </Badge>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex gap-2">
                       {d.status === 'pending' && (
                          <button onClick={() => approveDonation(d.donId)} className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                             <CheckCircle className="w-4 h-4" />
                          </button>
                       )}
                       <button onClick={() => deleteDonation(d.donId)} className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Donations;
