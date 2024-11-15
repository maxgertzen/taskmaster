import styled from '@emotion/styled';
import { DraggableStyle } from '@hello-pangea/dnd';

export const TaskItemContainer = styled.li<{
  style?: DraggableStyle;
  isDragging?: boolean;
}>(({ theme, style, isDragging }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  border: theme.borders.main(),
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  ...style,
  backgroundColor: isDragging ? theme.colors.accent : theme.colors.background,
}));

export const Container = styled.div<{ gap?: number; isCompleted?: boolean }>(
  ({ theme, gap = 0, isCompleted = false }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(gap),
    span: {
      textDecoration: isCompleted ? 'line-through' : 'none',
      color: isCompleted ? theme.colors.secondary : theme.colors.text,
    },
    cursor: 'default',
  })
);

export const DragIconWrapper = styled.div(({ theme }) => ({
  cursor: 'grab',
  flex: 1,
  marginRight: theme.spacing(2),
  svg: {
    cursor: 'grab',
  },
}));
