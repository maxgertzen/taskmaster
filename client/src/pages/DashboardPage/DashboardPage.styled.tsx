import styled from '@emotion/styled';

export const DashboardContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

export const MainLayout = styled.div({
  display: 'flex',
  flex: 1,
});

export const SidebarContainer = styled.div<{
  isCollapsed: boolean;
  width: number;
}>(({ theme, isCollapsed, width }) => ({
  position: 'relative',
  width: isCollapsed ? '0' : `${width}px`,
  padding: theme.spacing(2),
  backgroundColor: theme.colors.surface,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

export const TaskContainer = styled.div(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(6),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  borderTop: `${theme.spacing(0.5)} double ${theme.colors.grey}`,
  borderLeft: `${theme.spacing(0.5)} double ${theme.colors.grey}`,
}));

export const StyledCollapsibleButton = styled.button<{ isCollapsed: boolean }>(
  ({ theme, isCollapsed }) => ({
    position: 'absolute',
    top: 0,
    right: theme.spacing(-4.25),
    backgroundColor: theme.colors.surface,
    padding: theme.spacing(1),
    borderRight: `${theme.spacing(0.5)} double ${theme.colors.grey}`,
    borderBottom: `${theme.spacing(0.5)} double ${theme.colors.grey}`,
    cursor: 'pointer',
    zIndex: 1,
    svg: {
      transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.8s',
    },
  })
);
