import { createContext } from 'react';
export interface MockAuth0ContextInterface {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  getAccessTokenSilently: () => Promise<string>;
  loginWithRedirect: (options: {
    appState: {
      returnTo: string;
    };
  }) => void;
  logout: () => void;
  isLoading: boolean;
}

export const initialMockAuth0State: MockAuth0ContextInterface = {
  isAuthenticated: false,
  user: null,
  getAccessTokenSilently: async () => '',
  loginWithRedirect: () => {},
  logout: () => {},
  isLoading: false,
};

export const MockContext = createContext<MockAuth0ContextInterface>(
  initialMockAuth0State
);
