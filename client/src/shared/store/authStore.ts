import { create } from 'zustand';

import { UserDetails } from '../types/shared';

type AuthState = {
  token: string | null;
  user: UserDetails | null;
  setToken: (token: string | null) => void;
  setUser: (user: UserDetails | null) => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
}));
