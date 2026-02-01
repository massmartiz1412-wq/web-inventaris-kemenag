
import React, { useState, useEffect } from 'react';
import { Search, Package, MapPin, XCircle, CheckCircle, Image as ImageIcon, Plus, Minus, Edit, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { Item } from '../types';
import { isCheckDue, formatDate } from '../utils';

interface StockCheckProps {
  items: Item[];
  onCheck: (id: string) => void;
  onEdit: (item: Item) => void;
  onUpdateQuantity: (id: string, amount: number) => void;
}

const StockCheck: React.FC<StockCheckProps> = ({ items, onCheck, onEdit, onUpdateQuantity }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (hasSearched && query.trim()) {
      const searchLower = query.toLowerCase();
      const found = items.filter(i => 
        i.code.toLowerCase().includes(searchLower) || 
        i.name.toLowerCase().includes(searchLower)
      );
      setResults(found);
    }
  }, [items, query, hasSearched]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    const searchLower = query.toLowerCase();
    const found = items.filter(i => 
      i.code.toLowerCase().includes(searchLower) || 
      i.name.toLowerCase().includes(searchLower)
    );
    
    setResults(found);
    setHasSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Cek Stok Pintar</h1>
        <p className="text-slate-500 text-lg">Temukan barang dengan cepat & kelola ketersediaan</p>
      </header>

      <form onSubmit={handleSearch} className="relative group">
        <div className="flex bg-gradient-to-r from-indigo-50/50 to-white shadow-2xl rounded-3xl overflow-hidden ring-2 ring-indigo-100 group-focus-within:ring-indigo-500 group-focus-within:shadow-indigo-100 transition-all duration-300">
          <div className="flex items-center px-6 border-r border-indigo-50">
            <Search className="h-7 w-7 text-indigo-500 group-focus-within:scale-110 transition-transform" />
          </div>
          <input 
            type="text" 
            autoFocus
            className="flex-1 py-6 px-6 outline-none text-xl font-medium text-indigo-900 placeholder:text-indigo-200 bg-transparent"
            placeholder="Masukkan nama barang atau kode unik..."
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) setHasSearched(false);
            }}
          />
          <button 
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-10 font-black text-lg transition-all active:scale-95 shadow-lg flex items-center"
          >
            CARI
          </button>
        </div>
        <div className="absolute -z-10 -bottom-2 -right-2 w-full h-full bg-indigo-600/5 rounded-3xl blur-xl"></div>
      </form>

      {hasSearched && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {results.map((result) => {
                const checkDue = isCheckDue(result.lastChecked);
                const isAvailable = result.quantity > 0;
                
                return (
                  <div key={result.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-indigo-200 transition-all group overflow-hidden relative">
                    <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 transition-transform group-hover:scale-150 duration-700 ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    
                    <div className="flex flex-col md:flex-row gap-8 relative z-10">
                      <div className="w-full md:w-48 h-48 flex-shrink-0 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex items-center justify-center relative group-hover:shadow-lg transition-all">
                        {result.image ? (
                          <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center">
                              <ImageIcon className="h-12 w-12 text-slate-200" />
                              <span className="text-[10px] text-slate-300 font-bold mt-2">NO IMAGE</span>
                          </div>
                        )}
                        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black tracking-wider shadow-sm ${isAvailable ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {isAvailable ? 'READY' : 'EMPTY'}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h2 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{result.name}</h2>
                            <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs font-mono font-bold mt-1 uppercase tracking-wider">{result.code}</span>
                          </div>
                          <button 
                            onClick={() => onEdit(result)}
                            className="p-3 bg-white border border-slate-100 text-slate-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-4 border-y border-slate-50 my-4">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kuantitas</p>
                            <div className="flex items-center space-x-3">
                              <button onClick={() => onUpdateQuantity(result.id, -1)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"><Minus className="h-4 w-4" /></button>
                              <span className={`text-2xl font-black min-w-[1.5rem] text-center ${result.quantity === 0 ? 'text-red-600' : 'text-slate-800'}`}>{result.quantity}</span>
                              <button onClick={() => onUpdateQuantity(result.id, 1)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all active:scale-90"><Plus className="h-4 w-4" /></button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Area Simpan</p>
                            <p className="text-md font-black text-slate-700 flex items-center"><MapPin className="h-4 w-4 mr-1.5 text-indigo-500" />{result.location}</p>
                          </div>
                          <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Cek</p>
                              <p className="text-xs font-bold text-slate-600 flex items-center"><Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />{formatDate(result.lastChecked)}</p>
                          </div>
                        </div>

                        <button onClick={() => onCheck(result.id)} className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center transition-all transform active:scale-95 shadow-md ${checkDue ? 'bg-indigo-600 text-white hover:bg-indigo-700 animate-pulse' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          {checkDue ? 'KONFIRMASI CEK HARI INI' : 'DATA TERVERIFIKASI'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-200 text-center space-y-6">
              <div className="inline-flex items-center justify-center p-6 bg-red-50 rounded-full"><XCircle className="h-16 w-16 text-red-500" /></div>
              <h2 className="text-4xl font-black text-slate-800 uppercase tracking-tight">Barang Kosong</h2>
              <p className="text-slate-400 text-lg">"<strong>{query}</strong>" tidak ditemukan di sistem.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockCheck;
