import styled from '@emotion/styled';

export const MenuContainer = styled('div')<{
  top: number;
}>(({ theme, top }) => ({
  position: 'absolute',
  top,
  right: 0,
  maxWidth: '100%',
  background: theme.colors.surface,
  border: theme.borders.main(theme.colors.grey),
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.borders.radius,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1, 0),
}));

export const MenuItem = styled.span<{ disabled?: boolean }>(
  ({ theme, disabled }) => ({
    all: 'unset',
    padding: theme.spacing(1, 2),
    cursor: disabled ? 'not-allowed' : 'pointer',
    textAlign: 'left',
    ...(!disabled && {
      '&:hover': {
        background: theme.colors.grey,
        color: theme.colors.secondary,
      },
      '&:focus': {
        background: theme.colors.accent,
        outline: `2px solid ${theme.colors.primary}`,
      },
    }),
  })
);
