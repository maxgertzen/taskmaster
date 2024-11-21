import styled from '@emotion/styled';

export const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'outline' | 'danger';
}>(({ theme, variant }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.colors[variant === 'danger' ? 'outline' : variant],
  color:
    variant === 'outline'
      ? theme.colors.text
      : variant === 'danger'
        ? theme.colors.danger
        : theme.colors.background,
  fontWeight: 600,
  textTransform: 'uppercase',
  border: 'none',
  borderRadius: theme.borders.radius,
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.colors.secondary,
  },
  ...((variant === 'outline' || variant === 'danger') && {
    '&:hover': {
      backgroundColor:
        variant === 'danger' ? theme.colors.danger : theme.colors.accent,
      color: theme.colors.background,
    },
    border: theme.borders.main(
      variant === 'danger' ? theme.colors.danger : theme.colors.text
    ),
  }),
}));
