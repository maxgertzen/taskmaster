import styled from '@emotion/styled';

import PrimaryEmboss from '../../assets/sprites/buttons/primary-emboss.svg';
import PrimaryOutline from '../../assets/sprites/buttons/primary-empty.svg';
import PrimaryFilled from '../../assets/sprites/buttons/primary-filled.svg';
import SuccessEmpty from '../../assets/sprites/buttons/success-empty.svg';
import SuccessFilled from '../../assets/sprites/buttons/success-filled.svg';
import { ButtonType } from '../../types/shared';

const buttonMap: Record<string, string> = {
  primary: PrimaryOutline,
  primaryHover: PrimaryFilled,
  secondary: PrimaryEmboss,
  secondaryHover: PrimaryFilled,
  success: SuccessEmpty,
  successHover: SuccessFilled,
};
export const StyledButton = styled.button<{
  variant: ButtonType;
  isActive: boolean;
}>(({ theme, variant, isActive }) => ({
  fontSize: theme.typography.body.fontSize,
  textTransform: 'uppercase',
  border: 'none',
  cursor: 'pointer',
  backgroundImage: isActive
    ? `url(${buttonMap[`${variant}Hover`]})`
    : `url(${buttonMap[variant]})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  height: '2.5rem',
  width: '8rem',
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    backgroundImage: `url(${buttonMap[`${variant}Hover`]})`,
  },
  color: theme.colors.accent,
  pointerEvents: isActive ? 'none' : 'auto',
}));
