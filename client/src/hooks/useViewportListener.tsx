import { useEffect } from 'react';

import { useViewportStore } from '../store/store';

export const useViewportListener = () => {
  const setViewport = useViewportStore((state) => state.setViewport);

  useEffect(() => {
    const handleResize = () => {
      setViewport(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [setViewport]);
};
