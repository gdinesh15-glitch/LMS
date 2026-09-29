import React, { useState, useEffect } from 'react';
import { History, Search, Download, Filter, BookOpen, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Card, Badge } from '../../components/SharedUI';
import api from '../../api/axios';

const BorrowHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/faculty/history');
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to fetch history');
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const cardStyle = { 
    background: 'rgba(15,23,42,0.4)', 
    border: '1px solid rgba(51,65,85,0.3)', 
    backdropFilter: 'blur(20px)' 
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Borrowing Ledger</h1>
          <p className="text-xs font-medium text-slate-500">Complete historical record of your institutional asset engagements.</p>
        </div>
        <div className="flex gap-3">
           <button className="h-12 px-6 rounded-2xl bg-slate-800/50 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-700 transition-all">
              <Download className="w-4 h-4 text-indigo-400" /> Export PDF
           </button>
        </div>
      </div>

      <Card style={cardStyle} className="p-0 rounded-3xl overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-slate-900/40 border-b border-slate-800">
                     <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Book Information</th>
                     <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Engagement Timeline</th>
                     <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest">Engagement State</th>
                     <th className="py-5 px-8 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Penalty</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800/40">
                  {loading ? (
                    <tr>
                       <td colSpan="4" className="py-20">
                          <div className="flex flex-col items-center gap-4 opacity-50">
                             <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                             <p className="text-[9px] font-black text-white uppercase tracking-widest">Reconstructing Historical Data...</p>
                          </div>
                       </td>
                    </tr>
                  ) : history.map(t => (
                    <tr key={t._id} className="group hover:bg-white/[0.02] transition-colors">
                       <td className="py-5 px-8">
                          <div className="flex flex-col gap-1">
                             <span className="font-black text-xs text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{t.book?.title}</span>
                             <span className="text-[10px] font-bold text-slate-500 uppercase">{t.book?.author}</span>
                          </div>
                       </td>
                       <td className="py-5 px-8">
                          <div className="flex items-center justify-center gap-6">
                             <div className="text-center">
                                <p className="text-[8px] font-black text-slate-600 uppercase mb-0.5 tracking-tighter">Borrowed</p>
                                <p className="text-[10px] font-bold text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                             </div>
                             <div className="h-4 w-px bg-slate-800" />
                             <div className="text-center">
                                <p className="text-[8px] font-black text-slate-600 uppercase mb-0.5 tracking-tighter">Returned</p>
                                <p className="text-[10px] font-bold text-emerald-500">{t.returnDate ? new Date(t.returnDate).toLocaleDateString() : '--'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="py-5 px-8">
                          <Badge type={t.status === 'Returned' ? 'available' : t.status === 'Overdue' ? 'overdue' : 'primary'}>
                             {t.status.toUpperCase()}
                          </Badge>
                       </td>
                       <td className="py-5 px-8 text-right font-black text-xs text-rose-500">
                          {t.fineAmount > 0 ? `₹${t.fineAmount}` : '--'}
                       </td>
                    </tr>
                  ))}
                  {history.length === 0 && !loading && (
                    <tr>
                       <td colSpan="4" className="py-20 text-center text-xs font-black text-slate-600 uppercase tracking-widest italic">
                          No engagement records found in the institutional archive.
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

export default BorrowHistory;
