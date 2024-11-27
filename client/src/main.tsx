import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './fontawesome.ts';
import App from './App.tsx';
import AuthProvider from './auth/AuthProvider.tsx';
import GlobalStyles from './styles/globalStyles.tsx';
import { ThemeProvider } from './styles/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
