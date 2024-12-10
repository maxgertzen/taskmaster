import { FC } from 'react';

import { ButtonType } from '../../types/shared';

import { StyledButton } from './Button.styled';

interface ButtonProps {
  children: string;
  onClick?: () => void;
  variant?: ButtonType;
  disabled?: boolean;
  isActive?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  isActive = false,
}) => {
  return (
    <StyledButton
      variant={variant}
      disabled={disabled}
      isActive={isActive}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
};
