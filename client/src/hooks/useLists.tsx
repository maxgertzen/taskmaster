import { useQuery } from '@tanstack/react-query';

import { fetchLists } from '../api';
import { useAuthStore } from '../store/authStore';
import { List } from '../types/shared';

export const useLists = () => {
  const token = useAuthStore((state) => state.token);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: fetchLists(token),
    enabled: !!token,
  });

  return { lists: data as List[], isError, isLoading };
};
