import styled from '@emotion/styled';

export const MenuContainer = styled('div')<{
  orientation: 'left' | 'right' | 'full';
}>(({ theme, orientation }) => ({
  position: 'absolute',
  top: 0,
  ...((orientation === 'left' || orientation === 'right') && {
    right: orientation === 'left' ? 'auto' : 0,
    left: orientation === 'right' ? 'auto' : 0,
  }),
  background: theme.colors.surface,
  border: theme.borders.main(theme.colors.grey),
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.borders.radius,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1, 0),
  marginTop: theme.spacing(5),
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    marginTop: theme.spacing(4),
    width: orientation === 'full' ? '100vw' : 'auto',
  },
}));

export const MenuItem = styled.span<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    all: 'unset',
    padding: theme.spacing(1),
    cursor: disabled ? 'not-allowed' : 'pointer',
    textAlign: 'left',
    ...(!disabled && {
      '&:hover': {
        background: theme.colors.grey,
        color: theme.colors.background,
      },
      '&:focus': {
        background: theme.colors.accent,
        outline: `2px solid ${theme.colors.primary}`,
      },
    }),
  })
);
