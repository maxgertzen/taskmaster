import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { filterTasks, sortTasks } from '@/features/tasks/utils/taskHelpers';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import { STALE_TIME } from '@/shared/constants/staleTime';
import { useAuthStore } from '@/shared/store/authStore';
import { Filters, Sort } from '@/shared/types/mutations';
import { Task } from '@/shared/types/shared';

import { fetchTasks } from '../api';

type UseTasksInput = {
  listId?: string | null;
  filter?: Filters;
  sort?: Sort;
};

export const useTasks = ({ listId, filter, sort }: UseTasksInput) => {
  const token = useAuthStore((state) => state.token);

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

  return {
    tasks: filteredAndSortedTasks as Task[],
    isError: tasksQuery.isError,
  };
};
