import { create } from 'zustand';

import { List } from '../types/shared';

type DashboardStoreState = {
  searchTerm: string;
  selectedList: List | null;
  setSearchTerm: (term: string) => void;
  setSelectedList: (list: List | null) => void;
  resetSelectedList: () => void;
};

export const useDashboardStore = create<DashboardStoreState>((set) => ({
  searchTerm: '',
  selectedList: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedList: (list) => set({ selectedList: list }),
  resetSelectedList: () => set({ selectedList: null }),
}));

export type DashboardStore = ReturnType<typeof useDashboardStore>;
