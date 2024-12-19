import styled from '@emotion/styled';

export const TaskActionsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  width: '100%',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    width: '50%',
    input: {
      display: 'none',
    },
  },
}));

export const IconContainer = styled('button')(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-around',
  gap: theme.spacing(1),
  alignItems: 'center',
  textAlign: 'left',
  position: 'relative',
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    justifyContent: 'flex-end',
  },
}));
