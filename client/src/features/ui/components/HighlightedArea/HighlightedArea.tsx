import { FC, ReactNode } from 'react';

import { useSpotlightStore } from '@/shared/store/spotlightStore';

import { StyledHighlightedArea } from './HighlightedArea.styled';

interface HighlightedAreaProps {
  id: string;
  children: ReactNode;
}

export const HighlightedArea: FC<HighlightedAreaProps> = ({ id, children }) => {
  const isActive = useSpotlightStore((state) => state.target) === id;

  return (
    <StyledHighlightedArea isActive={isActive} data-spotlight={id}>
      {children}
    </StyledHighlightedArea>
  );
};
