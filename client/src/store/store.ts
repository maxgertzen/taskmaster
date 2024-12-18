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

interface ViewportStore {
  isMobile: boolean;
  setViewport: (width: number) => void;
}

export const useViewportStore = create<ViewportStore>((set) => ({
  isMobile: window.innerWidth < 768,
  setViewport: (width) => set({ isMobile: width < 768 }),
}));

interface SpotlightStore {
  target: string | null;
  setTarget: (target: string | null) => void;
}

export const useSpotlightStore = create<SpotlightStore>((set) => ({
  target: null,
  setTarget: (target) => set({ target }),
}));
