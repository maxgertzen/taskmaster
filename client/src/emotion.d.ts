import '@emotion/react';
import { Typography } from './shared/types/styled';
import { breakpoints } from './styles/theme';

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
