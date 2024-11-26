import styled from '@emotion/styled';

export const TaskListViewsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  width: '100%',
  gap: theme.spacing(1),
}));
