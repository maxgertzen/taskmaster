import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/api/query-keys';
import { STALE_TIME } from '@/shared/constants/staleTime';
import { useAuthStore } from '@/shared/store/authStore';
import { List } from '@/shared/types/shared';

import { fetchLists } from '../api';

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
