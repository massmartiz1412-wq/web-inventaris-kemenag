
import React from 'react';
import { LayoutDashboard, Package, Search, PlusCircle, LogOut } from 'lucide-react';
import { View } from '../types';

interface NavbarProps {
  activeView: View;
  setView: (view: View) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeView, setView, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventaris', icon: Package },
    { id: 'check', label: 'Cek Stok', icon: Search },
    { id: 'add', label: 'Tambah', icon: PlusCircle },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setView('dashboard')}>
              <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800 hidden sm:block">SIP <span className="text-indigo-600">Inventaris</span></span>
            </div>
            
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as View)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeView === item.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Bottom Navigation) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-3 px-4 shadow-lg z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`flex flex-col items-center space-y-1 ${
              activeView === item.id ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
