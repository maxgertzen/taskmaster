import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

import { useAuthStore } from '../store/authStore';

export const useInitializeToken = () => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const setToken = useAuthStore((state) => state.setToken);

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
};
