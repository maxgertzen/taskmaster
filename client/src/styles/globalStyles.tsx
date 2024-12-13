import { Global, css, Theme } from '@emotion/react';

import EarlyGameBoy from '../assets/fonts/EarlyGameBoy.ttf';
import PixelBold from '../assets/fonts/PixelArielBold.ttf';
import PixelRegular from '../assets/fonts/PixelArielRegular.ttf';

const GlobalStyles = () => (
  <Global
    styles={(theme: Theme) => css`
      @font-face {
        font-family: 'PixelArial11';
        src: url(${PixelRegular}) format('truetype');
        font-weight: 400; /* Regular weight */
        font-style: normal;
      }

      @font-face {
        font-family: 'PixelArial11';
        src: url(${PixelBold}) format('truetype');
        font-weight: 600; /* Bold weight */
        font-style: normal;
      }

      @font-face {
        font-family: 'EarlyGameBoy';
        src: url(${EarlyGameBoy}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }

      body {
        font-family: ${theme.typography.fontFamily};
        color: ${theme.colors.text};
        background-color: ${theme.colors.background};
      }
      h1 {
        font-size: ${theme.typography.h1.fontSize};
        font-weight: ${theme.typography.h1.fontWeight};
        font-family: ${theme.typography.headerFontFamily};
      }
      h2 {
        font-size: ${theme.typography.h2.fontSize};
        font-weight: ${theme.typography.h2.fontWeight};
        font-family: ${theme.typography.headerFontFamily};
      }
      h3 {
        font-size: ${theme.typography.h3.fontSize};
        font-weight: ${theme.typography.h3.fontWeight};
        font-family: ${theme.typography.headerFontFamily};
      }
      h4 {
        font-size: ${theme.typography.h4.fontSize};
        font-weight: ${theme.typography.h4.fontWeight};
        font-family: ${theme.typography.headerFontFamily};
      }
      h5 {
        font-size: ${theme.typography.h5.fontSize};
        font-weight: ${theme.typography.h5.fontWeight};
        font-family: ${theme.typography.headerFontFamily};
      }
      h6 {
        font-size: ${theme.typography.h6.fontSize};
        font-weight: ${theme.typography.h6.fontWeight};
        font-family: ${theme.typography.headerFontFamily};
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

      label {
        cursor: unset;
      }
    `}
  />
);

export default GlobalStyles;
