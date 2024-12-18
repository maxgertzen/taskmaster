import styled from '@emotion/styled';

import PrimaryEmboss from '../../assets/sprites/buttons/primary-emboss.png';
import PrimaryOutline from '../../assets/sprites/buttons/primary-empty.png';
import PrimaryFilled from '../../assets/sprites/buttons/primary-filled.png';
import SuccessEmpty from '../../assets/sprites/buttons/success-empty.png';
import SuccessFilled from '../../assets/sprites/buttons/success-filled.png';
import { ButtonType } from '../../types/shared';

const buttonMap: Record<string, string> = {
  primary: PrimaryOutline,
  primaryHover: PrimaryFilled,
  secondary: PrimaryEmboss,
  secondaryHover: PrimaryFilled,
  success: SuccessEmpty,
  successHover: SuccessFilled,
};
export const StyledButton = styled.button(({ theme }) => ({
  fontSize: theme.typography.body.fontSize,
  textTransform: 'uppercase',
  border: 'none',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  height: theme.spacing(3),
  width: '100%',
  padding: theme.spacing(2),
  whiteSpace: 'normal',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    padding: theme.spacing(1, 2),
    fontSize: theme.spacing(1),
  },
}));

export const ButtonWrapper = styled.div<{
  variant: ButtonType;
  isActive: boolean;
  isDarkTheme: boolean;
}>(({ theme, variant, isActive, isDarkTheme }) => ({
  position: 'relative',
  minWidth: 'fit-content',
  color: isDarkTheme ? theme.colors.background : theme.colors.text,
  backgroundPosition: 'center',
  backgroundSize: '100% 100%',
  backgroundImage: isActive
    ? `url(${buttonMap[`${variant}Hover`]})`
    : `url(${buttonMap[variant]})`,
  backgroundRepeat: 'no-repeat',
  '&:hover': {
    color: theme.colors.background,
    backgroundImage: `url(${buttonMap[`${variant}Hover`]})`,
  },
  pointerEvents: isActive ? 'none' : 'auto',
  transition: 'background-image 0.3s',
}));
