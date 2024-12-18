import { useQuery, useQueries, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import { QUERY_KEYS } from '../api/query-keys';
import { fetchTasks } from '../api/tasks-api';
import { STALE_TIME } from '../constants/staleTime';
import { useAuthStore } from '../store/authStore';
import { Filters, Sort } from '../types/mutations';
import { Task } from '../types/shared';
import { filterTasks, sortTasks } from '../utils/taskHelpers';

import { useLists } from './useLists';

type UseTasksInput = {
  listId: string | null;
  filter?: Filters;
  sort?: Sort;
  prefetchLimit?: number;
};

export const useTasks = ({
  listId,
  filter,
  sort,
  prefetchLimit,
}: UseTasksInput) => {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const { lists } = useLists();

  const tasksQuery = useQuery({
    queryFn: fetchTasks(token),
    queryKey: QUERY_KEYS.tasks({
      listId: listId as string,
    }),
    enabled: !!token && !!listId,
    staleTime: STALE_TIME,
  });

  const filteredAndSortedTasks = useMemo(() => {
    if (!tasksQuery.data) return [];

    let result = filterTasks(tasksQuery.data, filter);
    result = sortTasks(result, sort);

    return result;
  }, [tasksQuery.data, filter, sort]);

  useQueries({
    queries:
      lists
        ?.slice(0, prefetchLimit)
        .filter((list) => list.id !== listId)
        .map((list) => ({
          queryKey: QUERY_KEYS.tasks({ listId: list.id }),
          queryFn: fetchTasks(token),
          enabled: !!token,
          staleTime: STALE_TIME,
          gcTime: STALE_TIME * 2,
        })) ?? [],
  });

  const prefetchTasks = (listId: string) => {
    if (!token || !listId) return;

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.tasks({ listId }),
      queryFn: fetchTasks(token),
      staleTime: STALE_TIME,
    });
  };

  return {
    tasks: filteredAndSortedTasks as Task[],
    isError: tasksQuery.isError,
    prefetchTasks,
  };
};
