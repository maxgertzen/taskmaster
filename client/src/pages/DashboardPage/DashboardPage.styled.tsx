import styled from '@emotion/styled';

export const DashboardContainer = styled.div<{ isFullPage?: boolean }>(
  ({ isFullPage }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    ...(isFullPage && {
      justifyContent: 'center',
      alignItems: 'center',
    }),
  })
);

export const MainLayout = styled.div({
  display: 'flex',
  flex: 1,
});

export const SwipeContainer = styled.div<{ view: 'sidebar' | 'taskPanel' }>(
  ({ view }) => ({
    display: 'flex',
    width: '200%',
    height: '100%',
    transform: view === 'sidebar' ? 'translateX(0)' : 'translateX(-50%)',
    transition: 'transform 0.3s ease-in-out',
    [`@media (min-width: 769px)`]: {
      display: 'none',
    },
  })
);
