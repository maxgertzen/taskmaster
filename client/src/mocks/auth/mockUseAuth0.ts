import { createContext, useContext } from 'react';

const mockAuth0 = {
  isAuthenticated: true,
  user: { name: 'Test User', email: 'test@example.com' },
  getAccessTokenSilently: async () => 'mock-user-id',
  loginWithRedirect: () => console.log('Mock Login'),
  logout: () => console.log('Mock Logout'),
  isLoading: false,
};

const MockContext = createContext(mockAuth0);

export const useAuth0 = () => useContext(MockContext);
