import styled from '@emotion/styled';

export const TaskAreaContainer = styled('div')(({ theme }) => ({
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
    '& [data-spotlight="add-task"]:last-child': {
      marginTop: 'auto',
      paddingBottom: theme.spacing(1),
    },
  },
}));
