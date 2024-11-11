import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Dashboard, Login } from './pages';

const queryClient = new QueryClient();

// TODO:
// - Create a theme object and pss via ThemeProvider here
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
