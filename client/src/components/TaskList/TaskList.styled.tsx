import styled from '@emotion/styled';

export const StyledTaskListContainer = styled.ul<{ isDraggingOver: boolean }>(
  ({ isDraggingOver, theme }) => ({
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    backgroundColor: isDraggingOver ? theme.colors.secondary : 'transparent',
  })
);
