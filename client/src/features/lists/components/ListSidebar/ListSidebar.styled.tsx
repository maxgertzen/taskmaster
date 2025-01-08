import styled from '@emotion/styled';

export const ListSidebarContainer = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: 'start',
  gap: theme.spacing(2),
  width: '100%',
}));

export const ListSidebarUnorderedList = styled.ul<{ isDraggingOver: boolean }>(
  ({ isDraggingOver, theme }) => ({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    backgroundColor: isDraggingOver ? theme.colors.secondary : 'transparent',
    width: '100%',
    paddingLeft: theme.spacing(2),
  })
);
