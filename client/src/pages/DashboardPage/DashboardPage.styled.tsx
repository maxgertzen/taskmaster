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

export const SidebarContainer = styled.div(({ theme }) => ({
  width: '25%',
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
