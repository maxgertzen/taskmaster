import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App.tsx';
import { ThemeProvider, AuthProvider } from './shared/providers';
import GlobalStyles from './shared/styles/globalStyles.tsx';

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
