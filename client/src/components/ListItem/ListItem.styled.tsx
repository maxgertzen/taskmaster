import styled from '@emotion/styled';

export const ListItemContainer = styled.li<{ isActive?: boolean }>(
  ({ theme, isActive = false }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    fontWeight: 600,
    backgroundColor: isActive ? theme.colors.secondary : 'transparent',
    color: isActive ? theme.colors.background : theme.colors.text,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.accent,
    },
  })
);
