import { ThemeProvider } from '@emotion/react';
import { FC, ReactNode } from 'react';

import { darkTheme, lightTheme } from '@/shared/styles/theme';

interface TestProvidersProps {
  children?: ReactNode;
  theme?: 'light' | 'dark';
}

export const TestProviders: FC<TestProvidersProps> = ({
  children,
  theme = 'light',
}) => {
  const appliedTheme = theme === 'light' ? lightTheme : darkTheme;
  return <ThemeProvider theme={appliedTheme}>{children}</ThemeProvider>;
};
