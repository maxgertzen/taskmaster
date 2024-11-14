import styled from '@emotion/styled';

export const StyledButton = styled.button<{
  variant: 'primary' | 'secondary' | 'outline';
}>(({ theme, variant }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.colors[variant],
  color: theme.colors.background,
  fontWeight: 600,
  textTransform: 'uppercase',
  border: 'none',
  borderRadius: theme.borders.radius,
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.colors.secondary,
  },
  ...(variant === 'outline' && {
    '&:hover': {
      backgroundColor: theme.colors.accent,
    },
    border: theme.borders.main(theme.colors.text),
  }),
}));
