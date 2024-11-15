import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { useInitializeToken } from './hooks/useInitializeToken';
import { DashboardPage, HomePage } from './pages';

const queryClient = new QueryClient();

const App: React.FC = () => {
  useInitializeToken();

  return (
    <QueryClientProvider client={queryClient}>
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
