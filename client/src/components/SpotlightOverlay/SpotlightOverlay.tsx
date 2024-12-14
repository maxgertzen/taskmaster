import { FC, useEffect, useState } from 'react';

import { useSpotlightStore } from '../../store/store';

import { StyledSpotlightOverlay } from './SpotlightOverlay.styled';

export const SpotlightOverlay: FC = () => {
  const target = useSpotlightStore((state) => state.target);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (target) {
      const targetElement = document.querySelector(
        `[data-spotlight="${target}"]`
      );
      setTargetRect(targetElement?.getBoundingClientRect() ?? null);
      return;
    }
    setTargetRect(null);
  }, [target]);

  return <StyledSpotlightOverlay targetRect={targetRect} />;
};
