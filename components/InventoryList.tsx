
import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, AlertCircle, Edit, Trash2, Package, Check, X, Image as ImageIcon, Plus, Minus, Clock } from 'lucide-react';
import { Item } from '../types';
import { formatDate, isCheckDue } from '../utils';

interface InventoryListProps {
  items: Item[];
  onCheck: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: Item) => void;
  onUpdateQuantity: (id: string, amount: number) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onCheck, onDelete, onEdit, onUpdateQuantity }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Daftar Inventaris</h2>
          <p className="text-sm text-slate-500">Kelola stok dan pantau pengecekan harian</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Cari nama, kode, atau lokasi..."
            className="pl-10 pr-4 py-2.5 w-full border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Barang</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stok</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cek Terakhir</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const checkDue = isCheckDue(item.lastChecked);
                const isAvailable = item.quantity > 0;
                
                return (
                  <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors ${checkDue ? 'bg-amber-50/10' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center shadow-sm">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-slate-300" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{item.name}</span>
                          <span className="text-xs text-indigo-500 font-mono font-medium">{item.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isAvailable ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <Check className="h-3 w-3 mr-1" />
                          TERSEDIA
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                          <X className="h-3 w-3 mr-1" />
                          HABIS
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 transition-all active:scale-90"
                          title="Kurangi Stok"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 min-w-[3.5rem] text-center">
                           <span className={`text-sm font-black ${
                            item.quantity === 0 
                              ? 'text-red-600' 
                              : item.quantity < 5 
                                ? 'text-amber-600' 
                                : 'text-slate-800'
                          }`}>
                            {item.quantity}
                          </span>
                        </div>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 text-slate-600 transition-all active:scale-90"
                          title="Tambah Stok"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm font-medium text-slate-600">
                        <MapPin className="h-4 w-4 mr-1.5 text-indigo-400" />
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-xs text-slate-600 font-medium">
                          <Clock className="h-3 w-3 mr-1 text-slate-400" />
                          {formatDate(item.lastChecked)}
                        </div>
                        {checkDue ? (
                          <span className="text-[10px] text-amber-600 font-black flex items-center mt-1 uppercase tracking-tighter animate-pulse">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Perlu Dicek Hari Ini
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-black flex items-center mt-1 uppercase tracking-tighter">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Selesai Dicek
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        {/* Tombol Cek (Aktif Selalu) */}
                        <button 
                          onClick={() => onCheck(item.id)}
                          title={checkDue ? "Lakukan Pengecekan Sekarang" : "Update Waktu Pengecekan"}
                          className={`group relative p-2.5 rounded-xl border shadow-sm transition-all transform active:scale-90 ${
                            checkDue 
                              ? 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100' 
                              : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          <CheckCircle className={`h-5 w-5 ${checkDue ? 'animate-bounce' : ''}`} />
                          {checkDue && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                          )}
                        </button>
                        
                        {/* Tombol Edit */}
                        <button 
                          onClick={() => onEdit(item)}
                          title="Edit Detail Barang"
                          className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                        >
                          <Edit className="h-5 w-5" />
                        </button>

                        {/* Tombol Hapus */}
                        <button 
                          onClick={() => onDelete(item.id)}
                          title="Hapus Barang Permanen"
                          className="p-2.5 rounded-xl border border-red-200 bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-sm"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-slate-50 p-6 rounded-full mb-4">
                      <Package className="h-12 w-12 text-slate-200" />
                    </div>
                    <p className="text-slate-500 font-medium">Data barang tidak ditemukan</p>
                    <p className="text-slate-400 text-sm mt-1">Coba gunakan kata kunci pencarian yang berbeda.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center text-xs text-slate-400 px-2">
        <p>Menampilkan {filteredItems.length} dari {items.length} total barang</p>
        <p className="flex items-center italic">
          <Clock className="h-3 w-3 mr-1" /> Data tersimpan secara lokal di peramban Anda
        </p>
      </div>
    </div>
  );
};

export default InventoryList;
