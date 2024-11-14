import '@emotion/react';
import { Typography } from './types/styled';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      accent: string;
      grey: string;
      outline: string;
    };
    typography: Typography;
    spacing: (...values: number[]) => string;
    borders: {
      main: (customColor?: string, customWidth?: number) => string;
      radius: string;
      color: string;
      width: string;
    };
  }
}
