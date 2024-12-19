import styled from '@emotion/styled';

export const StyledListInput = styled.input(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  fontSize: '1rem',
  outline: 'none',
  border: 'none',
  backgroundColor: theme.colors.accent,
  color: theme.colors.text,
}));
