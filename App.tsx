
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import StockCheck from './components/StockCheck';
import AddItemForm from './components/AddItemForm';
import { Item, View } from './types';
import { loadFromStorage, saveToStorage } from './utils';
import { KeyRound, User as UserIcon, Lock, PlusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [items, setItems] = useState<Item[]>([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  useEffect(() => {
    const savedItems = loadFromStorage();
    if (savedItems.length > 0) {
      setItems(savedItems);
    } else {
        const initialData: Item[] = [
            { id: '1', name: 'Kertas HVS A4', code: 'KH-01', quantity: 50, location: 'Gudang A', lastChecked: new Date().toISOString() },
            { id: '2', name: 'Tinta Epson Hitam', code: 'T-EPS-01', quantity: 3, location: 'Rak 1', lastChecked: new Date(Date.now() - 86400000 * 2).toISOString() },
            { id: '3', name: 'Map Coklat', code: 'MC-05', quantity: 0, location: 'Gudang B', lastChecked: new Date().toISOString() },
        ];
        setItems(initialData);
        saveToStorage(initialData);
    }

    const auth = localStorage.getItem('isLoggedIn');
    if (auth === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (items.length >= 0) {
      saveToStorage(items);
    }
  }, [items]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === '123') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      setLoginError('');
    } else {
      setLoginError('Username atau password salah.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const addItem = (newItemData: Omit<Item, 'id' | 'lastChecked'>) => {
    if (editingItem) {
      setItems(items.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...newItemData } 
          : item
      ));
      setEditingItem(null);
    } else {
      const item: Item = {
        ...newItemData,
        id: crypto.randomUUID(),
        lastChecked: new Date().toISOString()
      };
      setItems([...items, item]);
    }
    setActiveView('inventory');
  };

  const updateQuantity = (id: string, amount: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + amount);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const checkItem = (id: string | string[]) => {
    const idsToCheck = Array.isArray(id) ? id : [id];
    setItems(items.map(item => 
      idsToCheck.includes(item.id) 
        ? { ...item, lastChecked: new Date().toISOString() } 
        : item
    ));
  };

  const deleteItem = (id: string | string[]) => {
    const idsToDelete = Array.isArray(id) ? id : [id];
    setItems(items.filter(item => !idsToDelete.includes(item.id)));
  };

  const handleImport = (newItems: Item[]) => {
    // Basic deduplication by code or ID
    const existingCodes = new Set(items.map(i => i.code));
    const uniqueNewItems = newItems.filter(i => !existingCodes.has(i.code));
    
    // Generate new UUIDs for safety during import if they collide, 
    // but usually we trust the backup
    const processedItems = uniqueNewItems.map(item => ({
      ...item,
      id: item.id || crypto.randomUUID(),
      lastChecked: item.lastChecked || new Date().toISOString()
    }));

    setItems([...items, ...processedItems]);
  };

  const startEditing = (item: Item) => {
    setEditingItem(item);
    setActiveView('add');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-indigo-600 p-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-4">
              <KeyRound className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">SIP Inventaris</h1>
            <p className="text-indigo-100 mt-1">Sistem Inventaris Pintar</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Username" 
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
            </div>
            {loginError && <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-2 rounded-lg">{loginError}</p>}
            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95"
            >
              Masuk
            </button>
            <div className="text-center text-slate-400 text-xs mt-4">
              <p>Contoh: admin / 123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Navbar activeView={activeView} setView={(v) => {
        if (v !== 'add') setEditingItem(null);
        setActiveView(v);
      }} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeView === 'dashboard' && <Dashboard items={items} onImport={handleImport} />}
          {activeView === 'inventory' && (
            <InventoryList 
              items={items} 
              onCheck={checkItem} 
              onDelete={deleteItem} 
              onEdit={startEditing}
              onUpdateQuantity={updateQuantity}
            />
          )}
          {activeView === 'check' && (
            <StockCheck 
              items={items} 
              onCheck={checkItem}
              onEdit={startEditing}
              onUpdateQuantity={updateQuantity}
            />
          )}
          {activeView === 'add' && (
            <AddItemForm 
              onAdd={addItem} 
              onCancel={() => {
                setEditingItem(null);
                setActiveView('inventory');
              }}
              initialData={editingItem || undefined}
            />
          )}
        </div>
      </main>

      <button 
        onClick={() => {
          setEditingItem(null);
          setActiveView('add');
        }}
        className="md:hidden fixed bottom-20 right-4 bg-indigo-600 text-white p-4 rounded-full shadow-2xl z-40"
      >
        <PlusCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default App;
