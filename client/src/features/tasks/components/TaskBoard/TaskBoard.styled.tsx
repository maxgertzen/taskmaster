import styled from '@emotion/styled';

export const TaskHeaderContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [`@media (max-width: ${theme.breakpoints.sm})`]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
}));
