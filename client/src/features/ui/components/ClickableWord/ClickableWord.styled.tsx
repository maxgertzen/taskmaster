import styled from '@emotion/styled';

export const StyledLink = styled('a')(({ theme }) => ({
  color: theme.colors.primary.accent,
  fontWeight: 500,
  textDecorationColor: theme.colors.primary.accent,
  cursor: 'pointer',

  '&:hover': {
    textDecoration: 'underline',
  },
}));
