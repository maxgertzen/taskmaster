import styled from '@emotion/styled';

export const StyledLoaderContainer = styled('div')<{ paddingTop: number }>(
  ({ theme, paddingTop }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
    paddingTop: theme.spacing(paddingTop),
  })
);

export const StyledLoaderLogo = styled('img')(({ theme }) => ({
  display: 'block',
  margin: 'auto',
  width: theme.spacing(10),
  maxWidth: '100%',
}));
