import styled from '@emotion/styled';

export const HomePageContainer = styled.main(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(4),
}));

export const ContentContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});
