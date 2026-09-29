import React, { useState, useEffect } from 'react';
import { DB, genId } from '../../utils/db';
import { Building2, MapPin, Plus, Trash2, Pencil, X, Map } from 'lucide-react';
import { Card, Badge, Button, Input } from '../../components/SharedUI';

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editBranch, setEditBranch] = useState(null);

  useEffect(() => { setBranches(DB.get('branches') || []); }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const location = fd.get('location');
    
    if (editBranch) {
      const updated = branches.map(b => b.id === editBranch.id ? { ...b, name, location } : b);
      DB.set('branches', updated); setBranches(updated);
      alert(`Branch "${name}" updated!`);
    } else {
      const newBranch = { id: genId('BR'), name, location };
      const updated = [...branches, newBranch];
      DB.set('branches', updated); setBranches(updated);
      alert(`Branch "${name}" added!`);
    }
    setShowForm(false); setEditBranch(null);
  };

  const deleteBranch = (id) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY remove this branch?')) return;
    const updated = branches.filter(b => b.id !== id);
    DB.set('branches', updated); setBranches(updated);
  };

  const startEdit = (b) => {
    setEditBranch(b);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in opacity-0">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">Branch Management</h2>
          <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Manage physical locations and distribution hubs</p>
        </div>
        <Button 
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => { setShowForm(!showForm); setEditBranch(null); }}
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Abort Operation' : 'Add New Branch'}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-t-4 border-t-[var(--accent-base)] shadow-2xl">
          <div className="flex items-center space-x-4 mb-10 border-b border-[var(--border-color)] pb-8">
            <div className="h-14 w-14 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-base)] shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight uppercase text-[var(--text-primary)]">
                {editBranch ? `Modifying: ${editBranch.name}` : 'Establish New Branch'}
              </h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Adding geographical node to the library network</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input label="Branch Name" name="name" required defaultValue={editBranch?.name || ''} placeholder="e.g. Main Campus Library" icon={Building2} />
              <Input label="Geographical Location" name="location" required defaultValue={editBranch?.location || ''} placeholder="e.g. Building A, Ground Floor" icon={MapPin} />
            </div>
            <div className="flex justify-end space-x-4 pt-8 border-t border-[var(--border-color)]">
              <Button variant="ghost" type="button" onClick={() => { setShowForm(false); setEditBranch(null); }}>Discard Changes</Button>
              <Button type="submit" className="px-10">
                {editBranch ? 'Update Record' : 'Save Branch'}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Branch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {branches.map((b, i) => (
          <Card key={b.id} delay={i + 1} className="group hover:-translate-y-2 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-[var(--accent-base)] group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8" />
              </div>
              <Badge type="primary">{b.id}</Badge>
            </div>
            
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight uppercase group-hover:text-indigo-600 transition-colors">{b.name}</h3>
              <div className="flex items-center space-x-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-loose">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{b.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
              <div className="flex items-center space-x-1 text-emerald-600">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
              </div>
              <div className="flex space-x-2 text-sm">
                <button 
                  onClick={() => startEdit(b)} 
                  className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all dark:bg-indigo-900/20 dark:hover:bg-indigo-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteBranch(b.id)} 
                  className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all dark:bg-rose-900/20 dark:hover:bg-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {branches.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <Map className="h-10 w-10" />
            </div>
            <h4 className="font-black text-lg uppercase tracking-tight text-slate-400">Regional Void</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">No branches have been established in the network yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Branches;
