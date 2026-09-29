import React, { useState, useEffect } from 'react';
import { Activity, Clock, Shield, Search, Filter, Loader2, BookOpen, Bookmark, Send } from 'lucide-react';
import { Card, Badge } from '../../components/SharedUI';
import api from '../../api/axios';

const FacultyActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/faculty/activity');
        setLogs(res.data || []);
      } catch (err) {
        console.error('Failed to fetch activity logs');
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const cardStyle = { 
    background: 'rgba(15,23,42,0.4)', 
    border: '1px solid rgba(51,65,85,0.3)', 
    backdropFilter: 'blur(20px)' 
  };

  const getIcon = (type) => {
    if (type.includes('RESERVE')) return <Bookmark className="w-4 h-4 text-blue-400" />;
    if (type.includes('RECOMMEND')) return <Send className="w-4 h-4 text-emerald-400" />;
    if (type.includes('LOAN') || type.includes('ISSUE')) return <BookOpen className="w-4 h-4 text-indigo-400" />;
    return <Activity className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Activity Protocol</h1>
        <p className="text-xs font-medium text-slate-500">Historical sequence of your interactions within the academic system.</p>
      </div>

      <Card style={cardStyle} className="p-0 rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/40 border-b border-slate-800">
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Sequence Action</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Resource Context</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Timestamp</th>
                <th className="py-6 px-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {loading ? (
                <tr>
                   <td colSpan="4" className="py-20">
                      <div className="flex flex-col items-center gap-4 opacity-50">
                         <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                         <p className="text-[9px] font-black text-white uppercase tracking-widest">Retrieving Protocol History...</p>
                      </div>
                   </td>
                </tr>
              ) : logs.map((log, idx) => (
                <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
                        {getIcon(log.actionType)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight">{log.actionType.replace(/_/g, ' ')}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.module}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <p className="text-[11px] font-medium text-slate-300 leading-relaxed max-w-xs">{log.message}</p>
                  </td>
                  <td className="py-6 px-8 text-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-black text-white">{new Date(log.createdAt).toLocaleDateString()}</span>
                      <span className="text-[9px] font-bold text-slate-600">{new Date(log.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 text-emerald-500/60">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                    </div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="py-20 text-center opacity-30">
                    <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-xs font-black text-white uppercase tracking-widest">No protocol entries recorded</p>
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

export default FacultyActivityLog;
