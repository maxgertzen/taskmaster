import { create } from 'zustand';

type SpotlightStoreState = {
  target: string | null;
  setTarget: (target: string | null) => void;
};

export const useSpotlightStore = create<SpotlightStoreState>((set) => ({
  target: null,
  setTarget: (target) => set({ target }),
}));

export type SpotlightStore = ReturnType<typeof useSpotlightStore>;
