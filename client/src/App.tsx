import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useInitializeToken } from './hooks/useInitializeToken';
import { useViewportListener } from './hooks/useViewportListener';
import { DashboardPage, HomePage } from './pages';

const queryClient = new QueryClient();

const App: React.FC = () => {
  useViewportListener();
  useInitializeToken();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Router>
        <Routes>
          <Route path='/' element={<DashboardPage />} />
          <Route path='/signin' element={<HomePage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
