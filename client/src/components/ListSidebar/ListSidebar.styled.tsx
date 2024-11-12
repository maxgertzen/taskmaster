import styled from '@emotion/styled';

export const ListSidebarContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const ListSidebarUnorderedList = styled.ul<{ isDraggingOver: boolean }>(
  ({ isDraggingOver, theme }) => ({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    backgroundColor: isDraggingOver ? theme.colors.secondary : 'transparent',
  })
);
