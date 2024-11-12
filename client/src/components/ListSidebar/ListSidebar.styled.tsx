import styled from '@emotion/styled';

export const ListSidebarContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const ListSidebarUnorderedList = styled.ul({
  listStyle: 'none',
  padding: 0,
  margin: 0,
});
