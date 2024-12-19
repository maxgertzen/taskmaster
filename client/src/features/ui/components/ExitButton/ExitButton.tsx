import { FC } from 'react';

import { Title } from '..';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';

import { StyledExitButton, TitleContainer } from './ExitButton.styled';

interface ExitButtonProps {
  isCollapsed: boolean;
  onClick: () => void;
}

export const ExitButton: FC<ExitButtonProps> = ({ isCollapsed, onClick }) => {
  return (
    <StyledExitButton role='button' onClick={onClick}>
      <TitleContainer>
        <SpriteIcon name='exit' />
        {!isCollapsed && <Title variant='h6'>Exit</Title>}
      </TitleContainer>
    </StyledExitButton>
  );
};
