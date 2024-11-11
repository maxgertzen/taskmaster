import styled from '@emotion/styled';

export const ListsActionsContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  paddingRight: theme.spacing(0.9),
}));
