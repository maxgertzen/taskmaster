import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/store';

export const useInitializeToken = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading, user } =
    useAuth0();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useUserStore((state) => state.setUser);

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
        name: user.name,
      });
    }
  }, [user, setUser]);
};
