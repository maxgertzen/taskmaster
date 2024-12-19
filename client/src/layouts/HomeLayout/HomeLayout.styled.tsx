import styled from '@emotion/styled';

export const HomeLayoutContainer = styled.main(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(4),
}));

export const CenteredContent = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  textAlign: 'center',
});
