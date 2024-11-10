import { create } from 'zustand';

interface TaskState {
  selectedListId: string | null;
  setSelectedListId: (id: string | null) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  selectedListId: null,
  setSelectedListId: (id) => set({ selectedListId: id }),
}));
