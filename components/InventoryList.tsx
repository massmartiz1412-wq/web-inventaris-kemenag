
import React, { useState } from 'react';
import { Search, MapPin, CheckCircle, AlertCircle, Edit, Trash2, Package, Check, X, Image as ImageIcon, Plus, Minus, Clock, QrCode, Square, CheckSquare, Trash } from 'lucide-react';
import { Item } from '../types';
import { formatDate, isCheckDue } from '../utils';

interface InventoryListProps {
  items: Item[];
  onCheck: (id: string | string[]) => void;
  onDelete: (id: string | string[]) => void;
  onEdit: (item: Item) => void;
  onUpdateQuantity: (id: string, amount: number) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onCheck, onDelete, onEdit, onUpdateQuantity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showQrModal, setShowQrModal] = useState<Item | null>(null);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Hapus ${selectedIds.length} barang yang terpilih?`)) {
      onDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleBulkCheck = () => {
    onCheck(selectedIds);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4 relative">
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

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center space-x-4">
            <span className="font-bold">{selectedIds.length} Barang Terpilih</span>
            <div className="h-4 w-px bg-indigo-400"></div>
            <button 
              onClick={handleBulkCheck}
              className="flex items-center text-sm font-semibold hover:text-indigo-100 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-1.5" /> Konfirmasi Cek
            </button>
            <button 
              onClick={handleBulkDelete}
              className="flex items-center text-sm font-semibold hover:text-red-200 text-red-100 transition-colors"
            >
              <Trash className="h-4 w-4 mr-1.5" /> Hapus Terpilih
            </button>
          </div>
          <button onClick={() => setSelectedIds([])} className="text-indigo-200 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left">
                <button onClick={toggleSelectAll} className="text-slate-400 hover:text-indigo-600 transition-colors">
                  {selectedIds.length === filteredItems.length && filteredItems.length > 0 ? (
                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Barang</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stok</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Cek Terakhir</th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const checkDue = isCheckDue(item.lastChecked);
                const isAvailable = item.quantity > 0;
                const isSelected = selectedIds.includes(item.id);
                
                return (
                  <tr key={item.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-indigo-50/30' : ''} ${checkDue ? 'bg-amber-50/10' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <button onClick={() => toggleSelect(item.id)} className={`${isSelected ? 'text-indigo-600' : 'text-slate-300'}`}>
                        {isSelected ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}
                      </button>
                    </td>
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
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 min-w-[3.5rem] text-center font-black">
                          {item.quantity}
                        </div>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 text-slate-600 transition-all active:scale-90"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      <div className="flex items-center">
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
                        {checkDue && (
                          <span className="text-[10px] text-amber-600 font-black flex items-center mt-1 uppercase tracking-tighter animate-pulse">
                            <AlertCircle className="h-3 w-3 mr-1" /> Perlu Dicek
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => setShowQrModal(item)}
                          title="Generate QR Code"
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          <QrCode className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onCheck(item.id)}
                          className={`p-2 rounded-lg transition-all ${checkDue ? 'bg-indigo-600 text-white' : 'bg-emerald-50 text-emerald-600'}`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button onClick={() => onEdit(item)} className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => onDelete(item.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white transition-all">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-20 text-center">
                   <div className="flex flex-col items-center justify-center">
                    <Package className="h-12 w-12 text-slate-200 mb-2" />
                    <p className="text-slate-500 font-medium">Data tidak ditemukan</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-violet-500"></div>
             <button onClick={() => setShowQrModal(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
              <X className="h-5 w-5" />
            </button>
            
            <h3 className="text-2xl font-black text-slate-800 mb-2">{showQrModal.name}</h3>
            <p className="text-indigo-600 font-mono font-bold mb-8 uppercase tracking-widest">{showQrModal.code}</p>
            
            <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 flex justify-center mb-8">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(showQrModal.code)}`} 
                alt="QR Code"
                className="w-48 h-48 rounded-xl shadow-lg"
              />
            </div>
            
            <button 
              onClick={() => window.print()}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              Cetak Label
            </button>
            <p className="text-slate-400 text-[10px] mt-4 font-bold uppercase tracking-widest">Gunakan label ini untuk identifikasi fisik</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
