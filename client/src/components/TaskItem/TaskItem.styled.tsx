import styled from '@emotion/styled';

export const TaskItemContainer = styled.li(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  border: theme.borders.main(),
  borderRadius: theme.spacing(0.5),
  marginBottom: theme.spacing(1),
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
}));

export const Container = styled.div<{ gap?: number }>(({ theme, gap = 0 }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(gap),
}));

export const DragIconWrapper = styled.div(({ theme }) => ({
  cursor: 'grab',
  marginRight: theme.spacing(2),
  svg: {
    cursor: 'grab',
  },
}));
