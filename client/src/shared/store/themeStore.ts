import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('theme') as ThemeMode) || 'light',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),
}));
