import styled from '@emotion/styled';

export const StyledLogoutButton = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  color: theme.colors.text,
  gap: theme.spacing(1),
  ':hover': {
    filter: 'invert(1)',
  },
}));
