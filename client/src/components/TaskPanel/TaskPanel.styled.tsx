import styled from '@emotion/styled';

export const TaskContainer = styled.div(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  borderTop: `${theme.spacing(0.5)} double ${theme.colors.grey}`,
  borderLeft: `${theme.spacing(0.5)} double ${theme.colors.grey}`,
}));
