import { QueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/api/query-keys';
import { STALE_TIME } from '@/shared/constants/staleTime';

import { fetchTasks } from '../api';

export const prefetchTasksForLists = (
  listIds: string[],
  queryClient: QueryClient,
  token: string | null
) => {
  if (!token || !listIds.length) return;

  listIds.forEach((listId) => {
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.tasks({ listId }),
      queryFn: fetchTasks(token),
      staleTime: STALE_TIME,
    });
  });
};
