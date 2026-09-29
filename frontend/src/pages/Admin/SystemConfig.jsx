import React, { useState, useEffect } from 'react';
import { DB, addAuditLog } from '../../utils/db';
import { Sliders, Pencil, Check, X, ShieldCheck, Database, Download, Upload } from 'lucide-react';
import { Card, Badge, Button } from '../../components/SharedUI';

const SystemConfig = () => {
  const [configs, setConfigs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => { setConfigs(DB.get('system_config') || []); }, []);

  const saveConfig = (cfg) => {
    const updated = configs.map(c => c.id === cfg.id ? { ...c, config_value: editValue } : c);
    DB.set('system_config', updated); setConfigs(updated); setEditing(null);
    addAuditLog('ADMIN01', 'CONFIG_UPDATE', cfg.config_key, `Changed to: ${editValue}`);
  };

  return (
    <div className="space-y-8 animate-in opacity-0">
      <div>
        <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)] uppercase">System Configuration</h2>
        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Global Governance & Regulatory Logic</p>
      </div>

      <Card className="p-0 border-none overflow-hidden shadow-xl">
        <div className="bg-[var(--bg-secondary)] px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
              <Sliders className="h-5 w-5" />
            </div>
            <h3 className="font-black text-lg tracking-tight uppercase">Operational Parameters</h3>
          </div>
          <Badge type="primary">v4.2.0-STABLE</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans">
            <thead>
              <tr className="bg-[var(--bg-primary)] border-b border-[var(--border-color)]">
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry Key</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Value</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Logic Specification</th>
                <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] bg-[var(--bg-card)]">
              {configs.map(cfg => (
                <tr key={cfg.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-6 px-8">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                      {cfg.config_key}
                    </span>
                  </td>
                  <td className="py-6 px-8">
                    {editing === cfg.id ? (
                      <input 
                        value={editValue} 
                        onChange={e => setEditValue(e.target.value)} 
                        autoFocus
                        className="pro-input w-32 py-1.5 bg-transparent" 
                      />
                    ) : (
                      <span className="text-sm font-black text-[var(--text-primary)]">{cfg.config_value}</span>
                    )}
                  </td>
                  <td className="py-6 px-8">
                    <p className="text-xs font-bold text-[var(--text-muted)] italic leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
                      {cfg.description}
                    </p>
                  </td>
                  <td className="py-6 px-8">
                    {editing === cfg.id ? (
                      <div className="flex space-x-2">
                        <button onClick={() => saveConfig(cfg)} className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditing(null)} className="p-2 rounded-xl bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-400"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        className="py-1.5 h-auto text-[10px] font-black uppercase tracking-widest px-4 border-slate-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                        onClick={() => { setEditing(cfg.id); setEditValue(cfg.config_value); }}
                      >
                        <Pencil className="w-3 h-3 mr-2" /> Modify
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-slate-900 to-indigo-900 text-white border-none p-10">
          <ShieldCheck className="h-10 w-10 text-indigo-400 mb-6" />
          <h4 className="text-xl font-black uppercase tracking-tight mb-4">Core Governance</h4>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">System configurations define the global constraints under which the VEMU LMS ecosystem operates. Changes here affect every branch and user identity.</p>
          <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-indigo-300">
            <span>Security Priority: CRITICAL</span>
          </div>
        </Card>

        {/* Database Backup & Restore */}
        <Card className="border-t-4 border-t-rose-500 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-rose-600">
              <Database className="h-5 w-5" />
            </div>
            <h3 className="font-black text-lg tracking-tight uppercase">Database Operations</h3>
          </div>
          <p className="text-slate-500 text-sm mb-8 font-medium">Create system snapshots or restore from a previous backup to prevent data loss.</p>
          
          <div className="space-y-4">
            <Button 
              className="w-full justify-center py-4 bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localStorage));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", `vemu_lms_backup_${new Date().toISOString().split('T')[0]}.json`);
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                addAuditLog('ADMIN01', 'DB_BACKUP', 'SYSTEM', 'Manual database backup created');
              }}
            >
              <Download className="w-4 h-4 mr-2" /> Download System Backup
            </Button>
            
            <div className="relative">
              <input 
                type="file" 
                accept=".json"
                id="restore-file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (!window.confirm("WARNING: This will overwrite current system data! Proceed?")) return;
                  
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    try {
                      const data = JSON.parse(event.target.result);
                      Object.keys(data).forEach(key => {
                        localStorage.setItem(key, data[key]);
                      });
                      addAuditLog('ADMIN01', 'DB_RESTORE', 'SYSTEM', 'System restored from backup');
                      alert("Database restored successfully. System will now reload.");
                      window.location.reload();
                    } catch (err) {
                      alert("Invalid backup file format.");
                    }
                  };
                  reader.readAsText(file);
                }}
              />
              <Button 
                variant="outline"
                className="w-full justify-center py-4 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-900/20"
                onClick={() => document.getElementById('restore-file').click()}
              >
                <Upload className="w-4 h-4 mr-2" /> Restore from Backup
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemConfig;
