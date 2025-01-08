import { useEffect } from 'react';

import { useViewportStore } from '@/shared/store/viewportStore';

export const useViewportListener = () => {
  const setViewport = useViewportStore((state) => state.setViewport);

  useEffect(() => {
    const updateViewport = () => {
      setViewport(window.innerWidth);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, [setViewport]);
};
