
import React, { useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, AlertTriangle, CheckCircle2, Download, Upload, Database, ShieldCheck } from 'lucide-react';
import { Item } from '../types';
import { isCheckDue, exportData } from '../utils';

interface DashboardProps {
  items: Item[];
  onImport: (items: Item[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ items, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const totalItems = items.length;
  const outOfStock = items.filter(i => i.quantity === 0).length;
  const needCheck = items.filter(i => isCheckDue(i.lastChecked)).length;
  const lowStock = items.filter(i => i.quantity > 0 && i.quantity < 5).length;

  const chartData = items.slice(0, 10).map(i => ({
    name: i.name.length > 10 ? i.name.substring(0, 8) + '..' : i.name,
    stok: i.quantity
  }));

  const stats = [
    { label: 'Total Barang', value: totalItems, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Stok Kosong', value: outOfStock, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Perlu Dicek', value: needCheck, icon: CheckCircle2, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Stok Rendah', value: lowStock, icon: AlertTriangle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedItems = JSON.parse(event.target?.result as string);
          if (Array.isArray(importedItems)) {
            if (confirm(`Impor ${importedItems.length} barang? Tindakan ini akan menambah data yang sudah ada.`)) {
              onImport(importedItems);
            }
          } else {
            alert('Format file tidak valid.');
          }
        } catch (err) {
          alert('Gagal membaca file backup.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Ringkasan Inventaris</h1>
          <p className="text-slate-500">Selamat datang kembali, admin.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => exportData(items)}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="h-4 w-4 mr-2 text-indigo-500" /> Ekspor JSON
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md"
          >
            <Upload className="h-4 w-4 mr-2" /> Impor Backup
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".json" 
            className="hidden" 
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className={`${stat.bg} p-3 rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Distribusi Stok Teratas</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="stok" radius={[4, 4, 0, 0]}>
                   {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.stok > 0 ? '#4f46e5' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-indigo-500" /> Status Keamanan
            </h3>
            <div className="space-y-4">
              <div className={`p-4 rounded-xl border ${needCheck > 0 ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                  <p className={`text-sm font-bold ${needCheck > 0 ? 'text-amber-800' : 'text-emerald-800'}`}>
                    {needCheck > 0 ? 'Tindakan Diperlukan' : 'Data Terverifikasi'}
                  </p>
                  <p className={`text-xs mt-1 ${needCheck > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {needCheck > 0 ? `${needCheck} barang melewati jadwal cek harian.` : 'Semua barang telah dicek hari ini.'}
                  </p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database</p>
                  <p className="text-sm font-bold text-slate-700">Lokal (Browser)</p>
                </div>
                <Database className="h-5 w-5 text-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
