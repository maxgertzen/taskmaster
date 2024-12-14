import styled from '@emotion/styled';

export const TaskContainer = styled.div(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  borderTop: `${theme.spacing(0.5)} double ${theme.colors.grey}`,
  borderLeft: `${theme.spacing(0.5)} double ${theme.colors.grey}`,
  [`@media (max-width: 768px)`]: {
    padding: theme.spacing(3),
    border: 'none',
    width: '50%',
    height: 'inherit',
    justifyContent: 'flex-start',
    '& :last-child': {
      marginTop: 'auto',
    },
  },
}));

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
