import styled from '@emotion/styled';

export const StyledExitButton = styled('div')(({ theme }) => ({
  isplay: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  cursor: 'pointer',
}));

export const TitleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
