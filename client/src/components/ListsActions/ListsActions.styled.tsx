import styled from '@emotion/styled';

export const ListsActionsContainer = styled.div(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  paddingRight: theme.spacing(0.9),
}));

export const TitleContainer = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
