import { useEffect } from 'react';

import { useAuthStore } from '../store/authStore';

import { useAuth } from './useAuth';

export const useInitializeToken = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading, user } =
    useAuth();
  const [setToken, setUser] = useAuthStore((state) => [
    state.setToken,
    state.setUser,
  ]);

  useEffect(() => {
    const fetchToken = async () => {
      if (!isAuthenticated || isLoading) {
        setToken(null);
        return;
      }

      try {
        const token = await getAccessTokenSilently();
        setToken(token);
      } catch (error) {
        console.error('Error fetching access token:', error);
        setToken(null);
      }
    };

    fetchToken();
  }, [getAccessTokenSilently, isAuthenticated, isLoading, setToken]);

  useEffect(() => {
    if (user?.name) {
      setUser({
        name: user.name?.split?.(' ')?.[0],
        email: user.email ?? '',
      });
    }
  }, [user, setUser]);
};
