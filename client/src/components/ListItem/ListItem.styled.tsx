import styled from '@emotion/styled';
import { DraggableStyle } from '@hello-pangea/dnd';

export const ListItemContainer = styled.li<{
  isActive?: boolean;
  style?: DraggableStyle;
  isDragging?: boolean;
}>(({ theme, style, isDragging, isActive = false }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1),
  fontWeight: 600,
  backgroundColor: isActive ? theme.colors.secondary : 'transparent',
  color: isActive ? theme.colors.background : theme.colors.text,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.colors.accent,
    color: theme.colors.text,
  },
  ...style,
  opacity: isDragging ? 0.5 : 1,
}));

export const ActionsContainer = styled.div({
  display: 'flex',
  gap: '0.5rem',
});

export const DragIconWrapper = styled.div(({ theme }) => ({
  cursor: 'grab',
  marginRight: theme.spacing(2),
  svg: {
    cursor: 'grab',
  },
}));

export const Container = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
