import { FC } from 'react';

import { SpriteIcon, Title } from '..';

import { StyledHomeButton, TitleContainer } from './HomeButton.styled';

interface HomeButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
}

export const HomeButton: FC<HomeButtonProps> = ({ isCollapsed, onClick }) => {
  return (
    <StyledHomeButton data-testid='home-button' role='button' onClick={onClick}>
      <TitleContainer>
        <SpriteIcon name='home' />
        {!isCollapsed && <Title variant='h6'>Home</Title>}
      </TitleContainer>
    </StyledHomeButton>
  );
};
