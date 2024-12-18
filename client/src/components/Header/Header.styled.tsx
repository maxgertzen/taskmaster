import styled from '@emotion/styled';

export const HeaderContainer = styled.header(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.colors.surface,
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    padding: theme.spacing(1),
    height: '10vh',
  },
}));

export const UserActionsContainer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  span: {
    marginRight: theme.spacing(1),
  },
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    backgroundColor: theme.colors.surface,
    zIndex: 1000,
    gap: theme.spacing(1),
    padding: theme.spacing(2),
    height: 'inherit',
    span: {
      marginRight: 0,
      flex: 1,
    },
  },
}));

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
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    order: -1,
    gap: theme.spacing(2),
  },
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
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    flexDirection: 'row-reverse',
    gap: theme.spacing(1),
  },
}));

export const BackButtonWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  flex: 1,
});

export const UserActionPanelViewContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: 'inherit',
  padding: theme.spacing(1),
}));
