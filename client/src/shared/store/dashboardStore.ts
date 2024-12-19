import { create } from 'zustand';

import { List } from '../types/shared';

type DashboardStore = {
  searchTerm: string;
  selectedList: List | null;
  setSearchTerm: (term: string) => void;
  setSelectedList: (list: List | null) => void;
  resetSelectedList: () => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  searchTerm: '',
  selectedList: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedList: (list) => set({ selectedList: list }),
  resetSelectedList: () => set({ selectedList: null }),
}));
