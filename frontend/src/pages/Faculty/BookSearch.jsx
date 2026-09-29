import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, BookOpen, Bookmark, CheckCircle, 
  AlertTriangle, ArrowRight, Loader2, Info
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/SharedUI';
import api from '../../api/axios';

const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reserving, setReserving] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get(`/books?q=${query}`);
      setBooks(res.data);
    } catch (err) {
      console.error('Search failed');
    }
    setLoading(false);
  };

  useEffect(() => { handleSearch(); }, []);

  const handleReserve = async (bookId) => {
    setReserving(bookId);
    try {
      const res = await api.post('/faculty/reserve', { bookId });
      if (res.data.success) {
        alert('✅ Reservation successful! You will be notified when it is ready for pickup.');
        handleSearch(); // Refresh the list
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Reservation failed');
    }
    setReserving(null);
  };

  const cardStyle = { 
    background: 'rgba(15,23,42,0.4)', 
    border: '1px solid rgba(51,65,85,0.3)', 
    backdropFilter: 'blur(20px)' 
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Search Academic Catalog</h1>
        <p className="text-xs font-medium text-slate-500">Explore the university collection and reserve items for your research.</p>
      </div>

      {/* Search Bar Section */}
      <div style={cardStyle} className="p-2 rounded-[2rem] flex flex-col md:flex-row gap-2">
         <div className="flex-1 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
            <input 
              className="w-full bg-transparent border-none h-16 pl-14 pr-4 text-white font-bold outline-none placeholder:text-slate-700"
              placeholder="Search by Title, Author, ISBN or Category..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
         </div>
         <button onClick={handleSearch} className="h-14 md:h-16 px-10 rounded-3xl bg-indigo-600 text-white text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">
            Execute Search
         </button>
      </div>

      {/* Results Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
           <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
           <p className="text-[10px] font-black text-white uppercase tracking-widest">Querying Central Repository...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {books.map(book => (
            <div key={book._id} style={cardStyle} className="rounded-[2.5rem] p-8 flex flex-col group hover:border-slate-600 transition-all">
               <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                     <BookOpen className="w-7 h-7" />
                  </div>
                  <Badge type={book.availableCopies > 0 ? 'available' : 'overdue'}>
                    {book.availableCopies > 0 ? 'IN STOCK' : 'BORROWED'}
                  </Badge>
               </div>
               
               <div className="flex-1 space-y-2 mb-8">
                  <h3 className="text-lg font-black text-white leading-tight uppercase tracking-tight">{book.title}</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{book.author}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                     <span className="px-3 py-1 rounded-full bg-slate-800/50 text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-700/50">{book.category}</span>
                     <span className="px-3 py-1 rounded-full bg-slate-800/50 text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-700/50">{book.edition || '1st Edition'}</span>
                  </div>
               </div>

               <div className="space-y-4 pt-6 border-t border-slate-800/50">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                     <span>Availability</span>
                     <span className="text-white">{book.availableCopies} / {book.totalCopies} Copies</span>
                  </div>
                  <button 
                    disabled={reserving === book._id}
                    onClick={() => handleReserve(book._id)}
                    className="w-full h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    {reserving === book._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bookmark className="w-3 h-3" />}
                    Reserve Item
                  </button>
               </div>
            </div>
          ))}
          {books.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center space-y-4 opacity-30">
               <Info className="w-12 h-12 text-slate-500 mx-auto" />
               <p className="text-xs font-black text-white uppercase tracking-widest">No assets found matching your criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookSearch;
