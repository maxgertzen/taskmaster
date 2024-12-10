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
