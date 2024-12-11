import styled from '@emotion/styled';

import { fadeIn, fadeOut } from '../../styles/globalStyles';

export const HeaderContainer = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.colors.surface,
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    padding: theme.spacing(1),
  },
}));

export const UserActionsContainer = styled.div<{ isMobileOpen: boolean }>(
  ({ theme, isMobileOpen }) => ({
    display: 'flex',
    alignItems: 'center',
    span: {
      marginRight: theme.spacing(1),
    },
    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      display: isMobileOpen ? 'flex' : 'none',
      flexDirection: 'column-reverse',
      justifyContent: 'center',
      alignItems: 'start',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: theme.colors.surface,
      zIndex: 1000,
      gap: theme.spacing(1),
      padding: theme.spacing(2),
      animation: isMobileOpen
        ? `${fadeIn} 0.3s ease-in-out forwards`
        : `${fadeOut} 0.3s ease-in-out backwards`,
    },
  })
);

export const HamburgerMenu = styled.div(({ theme }) => ({
  display: 'none',
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    display: 'block',
    cursor: 'pointer',
    padding: theme.spacing(1),
    zIndex: 1100,
  },
}));

export const UserMenuContainer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  marginLeft: theme.spacing(1),
}));

export const VerticalDivider = styled.div(({ theme }) => ({
  width: '1px',
  height: '24px',
  backgroundColor: theme.colors.text,
  margin: theme.spacing(0, 2),
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    display: 'none',
  },
}));

export const UserNameContainer = styled.span(({ theme }) => ({
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    display: 'none',
  },
}));
