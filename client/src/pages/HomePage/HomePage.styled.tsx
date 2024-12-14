import styled from '@emotion/styled';

export const HomePageContainer = styled.main(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(4),
  button: {
    fontSize: theme.typography.h6.fontSize,
    padding: theme.spacing(2),
  },
}));

export const ContentContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  textAlign: 'center',
});
