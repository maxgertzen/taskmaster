import { FC, MouseEvent, ReactNode } from 'react';

import { useSpotlightStore } from '@/shared/store/spotlightStore';

import { StyledLink } from './ClickableWord.styled';

interface ClickableWordProps {
  target: string;
  children: ReactNode;
}

export const ClickableWord: FC<ClickableWordProps> = ({ target, children }) => {
  const setTarget = useSpotlightStore((state) => state.setTarget);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setTarget(target);
    setTimeout(() => {
      setTarget(null);
    }, 1500);
  };
  return (
    <StyledLink href='#' onClick={handleClick}>
      {children}
    </StyledLink>
  );
};
