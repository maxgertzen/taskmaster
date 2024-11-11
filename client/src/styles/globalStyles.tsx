import { Global, css, Theme } from '@emotion/react';

const GlobalStyles = () => (
  <Global
    styles={(theme: Theme) => css`
      body {
        font-family: ${theme.typography.fontFamily};
        color: ${theme.colors.text};
        background-color: ${theme.colors.background};
      }
      h1 {
        font-size: ${theme.typography.h1.fontSize};
        font-weight: ${theme.typography.h1.fontWeight};
      }
      h2 {
        font-size: ${theme.typography.h2.fontSize};
        font-weight: ${theme.typography.h2.fontWeight};
      }
      h3 {
        font-size: ${theme.typography.h3.fontSize};
        font-weight: ${theme.typography.h3.fontWeight};
      }
      h4 {
        font-size: ${theme.typography.h4.fontSize};
        font-weight: ${theme.typography.h4.fontWeight};
      }
      h5 {
        font-size: ${theme.typography.h5.fontSize};
        font-weight: ${theme.typography.h5.fontWeight};
      }
      h6 {
        font-size: ${theme.typography.h6.fontSize};
        font-weight: ${theme.typography.h6.fontWeight};
      }
      p {
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.body.fontWeight};
      }
      small {
        font-size: ${theme.typography.small.fontSize};
        font-weight: ${theme.typography.small.fontWeight};
      }
      li {
        font-size: ${theme.typography.body.fontSize};
      }
    `}
  />
);

export default GlobalStyles;
