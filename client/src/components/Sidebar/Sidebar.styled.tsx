import styled from '@emotion/styled';

export const SidebarContainer = styled.div<{
  isCollapsed: boolean;
  width: number;
}>(({ theme, isCollapsed, width }) => ({
  position: 'relative',
  width: isCollapsed ? theme.spacing(4) : `${width}px`,
  padding: theme.spacing(2),
  backgroundColor: theme.colors.surface,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  alignItems: isCollapsed ? 'center' : 'start',
  gap: theme.spacing(2),
  [`@media (max-width: 768px)`]: {
    width: '50%',
    height: '100%',
    padding: theme.spacing(1, 2),
    alignItems: 'start',
  },
}));

export const StyledCollapsibleButton = styled.button(({ theme }) => ({
  backgroundColor: theme.colors.surface,
  cursor: 'pointer',
}));

export const PanelButtonContainer = styled.div(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
}));
