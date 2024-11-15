import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

// TODO:
// implement zustand's devtools middleware
export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));
