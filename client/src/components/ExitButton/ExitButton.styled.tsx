import styled from '@emotion/styled';

export const StyledExitButton = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  cursor: 'pointer',
  marginTop: 'auto',
}));

export const TitleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
