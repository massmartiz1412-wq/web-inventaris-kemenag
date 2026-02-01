
export const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Belum pernah';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const isCheckDue = (lastCheckedStr: string) => {
  if (!lastCheckedStr) return true;
  const lastChecked = new Date(lastCheckedStr);
  const now = new Date();
  
  // Set time to midnight for comparison to track "day" boundary
  const lastDate = new Date(lastChecked.getFullYear(), lastChecked.getMonth(), lastChecked.getDate());
  // Fix: changed 'today.getDate()' to 'now.getDate()' because 'today' is currently being declared
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  return lastDate < today;
};

export const STORAGE_KEY = 'inventaris_data_v1';

export const saveToStorage = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadFromStorage = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const exportData = (items: any[]) => {
  const dataStr = JSON.stringify(items, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `backup_inventaris_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};
