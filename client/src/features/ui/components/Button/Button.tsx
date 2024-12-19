import { FC } from 'react';

import { useThemeStore } from '@/shared/store/themeStore';
import { ButtonType } from '@/shared/types/ui';

import { ButtonWrapper, StyledButton } from './Button.styled';

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
  const theme = useThemeStore((state) => state.theme);
  return (
    <ButtonWrapper
      variant={variant}
      isActive={isActive}
      isDarkTheme={theme === 'dark'}
    >
      <StyledButton disabled={disabled} onClick={onClick}>
        {children}
      </StyledButton>
    </ButtonWrapper>
  );
};
