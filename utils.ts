
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
