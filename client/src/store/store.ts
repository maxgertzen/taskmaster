import { create } from 'zustand';

interface TaskStore {
  selectedListId: string | null;
  setSelectedListId: (id: string | null) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  selectedListId: null,
  setSelectedListId: (id) => set({ selectedListId: id }),
}));

// TODO:
// - This should be null by default
// - if the user is not logged in
interface UserStore {
  user: { name: string };
  setUser: (user: { name: string }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: { name: 'John Doe' },
  setUser: (user) => set({ user }),
}));
