import { create } from 'zustand';

interface TaskStore {
  searchTerm: string;
  selectedListId: string | null;
  setSearchTerm: (term: string) => void;
  setSelectedListId: (id: string | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  searchTerm: '',
  selectedListId: null,
  setSearchTerm: (term) => set({ searchTerm: term }),
  setSelectedListId: (id) => set({ selectedListId: id }),
}));

interface UserStore {
  user: { name: string };
  setUser: (user: { name: string }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: { name: '' },
  setUser: (user) => set({ user }),
}));
