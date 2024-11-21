import styled from '@emotion/styled';

export const TaskActionsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '100%',
  gap: theme.spacing(1),
}));

export const IconContainer = styled('div')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-around',
  gap: theme.spacing(1),
  alignItems: 'center',
}));
