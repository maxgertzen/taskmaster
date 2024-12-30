import { useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { MOCK_USER_ID } from '@/constants';

import { initialMockAuth0State, MockContext } from './MockContext';

export const MockAuth0Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState(initialMockAuth0State);

  const loginWithRedirect = useCallback(
    (options: { appState: { returnTo: string } }) => {
      setAuthState({
        ...authState,
        isAuthenticated: true,
        user: { name: 'Test User', email: 'test@user.com' },
        isLoading: false,
      });

      localStorage.setItem('mock-auth0-token', MOCK_USER_ID || '');

      navigate(options.appState.returnTo);
    },
    [navigate, authState]
  );

  const logout = useCallback(() => {
    setAuthState({
      ...authState,
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });

    localStorage.removeItem('mock-auth0-token');
    navigate('/signin');
  }, [navigate, authState]);

  const getAccessTokenSilently = useCallback(async () => {
    return localStorage.getItem('mock-auth0-token') || '';
  }, []);

  const value = {
    ...authState,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  };

  return <MockContext.Provider value={value}>{children}</MockContext.Provider>;
};
