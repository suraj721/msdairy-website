import { create } from 'zustand';

interface User { id: string; name: string; email: string; phone?: string; role: string; avatar?: string; loyaltyPoints?: number; }

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const stored = localStorage.getItem('ms_user');

export const useAuthStore = create<AuthState>((set) => ({
  user: stored ? JSON.parse(stored) : null,
  token: localStorage.getItem('ms_token'),
  isAuthenticated: !!localStorage.getItem('ms_token'),
  login: (user, token) => {
    localStorage.setItem('ms_token', token);
    localStorage.setItem('ms_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('ms_token');
    localStorage.removeItem('ms_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
  setUser: (user) => {
    localStorage.setItem('ms_user', JSON.stringify(user));
    set({ user });
  },
}));
