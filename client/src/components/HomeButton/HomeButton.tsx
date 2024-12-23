import { FC } from 'react';

import { SpriteIcon } from '../SpriteIcon/SpriteIcon';
import { Title } from '../Title/Title';

import { StyledHomeButton, TitleContainer } from './HomeButton.styled';

interface HomeButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
}

export const HomeButton: FC<HomeButtonProps> = ({ isCollapsed, onClick }) => {
  return (
    <StyledHomeButton role='button' onClick={onClick}>
      <TitleContainer>
        <SpriteIcon name='home' />
        {!isCollapsed && <Title variant='h6'>Home</Title>}
      </TitleContainer>
    </StyledHomeButton>
  );
};
