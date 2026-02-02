
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Package, AlertTriangle, CheckCircle2, MapPin } from 'lucide-react';
import { Item } from '../types';
import { isCheckDue } from '../utils';

interface DashboardProps {
  items: Item[];
}

const Dashboard: React.FC<DashboardProps> = ({ items }) => {
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Inventaris</h1>
        <p className="text-slate-500">Selamat datang kembali, admin.</p>
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

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Aksi Cepat</h3>
          <div className="space-y-4 flex-1">
            <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-lg">
                <p className="text-sm text-indigo-800 font-medium">Pengingat Harian</p>
                <p className="text-xs text-indigo-600 mt-1">Ada {needCheck} barang yang belum diperiksa hari ini.</p>
            </div>
            <div className="p-4 border border-red-100 bg-red-50/50 rounded-lg">
                <p className="text-sm text-red-800 font-medium">Stok Menipis</p>
                <p className="text-xs text-red-600 mt-1">Periksa {lowStock} barang dengan stok di bawah 5.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
