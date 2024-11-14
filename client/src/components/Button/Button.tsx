import { FC } from 'react';

import { StyledButton } from './Button.styled';

interface ButtonProps {
  children: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
}) => {
  return (
    <StyledButton type={type} variant={variant} onClick={onClick}>
      {children}
    </StyledButton>
  );
};
