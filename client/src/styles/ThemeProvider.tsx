import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import React, { ReactNode } from 'react';

import { useThemeStore } from '../store/themeStore';

import { lightTheme, darkTheme } from './theme';

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const theme = useThemeStore((state) => state.theme);
  const themeColors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <EmotionThemeProvider theme={themeColors}>{children}</EmotionThemeProvider>
  );
};
