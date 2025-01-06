import { create } from 'zustand';

type ViewportStoreState = {
  isMobile: boolean;
  setViewport: (width: number) => void;
};

export const useViewportStore = create<ViewportStoreState>((set) => ({
  isMobile: window.innerWidth < 768,
  setViewport: (width) => set({ isMobile: width < 768 }),
}));

export type ViewportStore = ReturnType<typeof useViewportStore>;
