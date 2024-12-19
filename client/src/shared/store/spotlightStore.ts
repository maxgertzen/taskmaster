import { create } from 'zustand';

type SpotlightStore = {
  target: string | null;
  setTarget: (target: string | null) => void;
};

export const useSpotlightStore = create<SpotlightStore>((set) => ({
  target: null,
  setTarget: (target) => set({ target }),
}));
