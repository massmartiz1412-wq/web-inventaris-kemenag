
export interface Item {
  id: string;
  name: string;
  code: string;
  quantity: number;
  location: string;
  description?: string;
  lastChecked: string; // ISO String
  image?: string; // Base64 string
}

export type View = 'dashboard' | 'inventory' | 'check' | 'add';

export interface User {
  username: string;
  role: 'admin';
}
