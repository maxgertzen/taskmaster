import '@emotion/react';
import { breakpoints } from './styles/theme';
import { Typography } from './types/styled';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: { main: string; accent: string };
      secondary: string;
      background: string;
      surface: string;
      text: string;
      accent: string;
      grey: string;
      outline: string;
      danger: string;
    };
    typography: Typography;
    spacing: (...values: number[]) => string;
    borders: {
      main: (customColor?: string, customWidth?: number) => string;
      radius: string;
      color: string;
      width: string;
    };
    breakpoints: typeof breakpoints;
  }
}
