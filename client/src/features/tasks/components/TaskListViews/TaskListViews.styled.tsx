import styled from '@emotion/styled';

export const TaskListViewsContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '5fr 1fr 1fr',
  gridAutoRows: '1fr',
  justifyItems: 'center',
  alignItems: 'center',
  width: '50%',
  gap: theme.spacing(0, 2),
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    width: '100%',
  },
}));

export const StyledButtonsWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  gap: theme.spacing(1),
  alignItems: 'center',
  width: '100%',
  [`@media (min-width: ${theme.breakpoints.sm})`]: {
    justifyContent: 'space-between',
  },
}));
