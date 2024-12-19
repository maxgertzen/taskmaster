import { create } from 'zustand';

type ViewportStore = {
  isMobile: boolean;
  setViewport: (width: number) => void;
};

export const useViewportStore = create<ViewportStore>((set) => ({
  isMobile: window.innerWidth < 768,
  setViewport: (width) => set({ isMobile: width < 768 }),
}));
