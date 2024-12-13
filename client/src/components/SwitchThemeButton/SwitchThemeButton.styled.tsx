import styled from '@emotion/styled';

export const StyledSwitchThemeButton = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  gap: theme.spacing(1),
}));
