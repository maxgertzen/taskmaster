import React from 'react';

export const MockAuth0Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mockAuth0 = {
    isAuthenticated: true,
    user: { name: 'Test User', email: 'test@example.com' },
    getAccessTokenSilently: async () => 'mock-token',
    loginWithRedirect: () => console.log('Mock Login'),
    logout: () => console.log('Mock Logout'),
  };

  const MockContext = React.createContext(mockAuth0);

  return (
    <MockContext.Provider value={mockAuth0}>{children}</MockContext.Provider>
  );
};

export default MockAuth0Provider;
