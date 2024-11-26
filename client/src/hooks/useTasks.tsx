import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '../api/query-keys';
import { fetchTasks } from '../api/tasks-api';
import { STALE_TIME } from '../constants/staleTime';
import { useAuthStore } from '../store/authStore';
import { Filters, Sort } from '../types/mutations';
import { Task } from '../types/shared';

type UseTasksInput = {
  listId: string | null;
  filter?: Filters;
  sort?: Sort;
};

export const useTasks = ({ listId, filter, sort }: UseTasksInput) => {
  const token = useAuthStore((state) => state.token);

  const tasksQuery = useQuery({
    queryFn: fetchTasks(token),
    queryKey: QUERY_KEYS.tasks({
      listId: listId as string,
      filter,
      sort,
    }),
    enabled: !!token && !!listId,
    staleTime: STALE_TIME,
  });

  return { tasks: tasksQuery.data as Task[], isError: tasksQuery.isError };
};
