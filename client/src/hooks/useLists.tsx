import { useQuery } from '@tanstack/react-query';

import { fetchLists } from '../api';
import { QUERY_KEYS } from '../api/query-keys';
import { STALE_TIME } from '../constants/staleTime';
import { useAuthStore } from '../store/authStore';
import { List } from '../types/shared';

export const useLists = () => {
  const token = useAuthStore((state) => state.token);

  const listsQuery = useQuery({
    queryFn: fetchLists(token),
    queryKey: QUERY_KEYS.lists,
    enabled: !!token,
    staleTime: STALE_TIME,
  });

  return { lists: listsQuery.data as List[], isError: listsQuery.isError };
};
