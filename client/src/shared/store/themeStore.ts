import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface ThemeStoreState {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStoreState>((set) => ({
  theme: (localStorage.getItem('theme') as ThemeMode) || 'light',
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return { theme: newTheme };
    }),
}));

export type ThemeStore = ReturnType<typeof useThemeStore>;
