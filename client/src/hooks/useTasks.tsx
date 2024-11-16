import { useQuery } from '@tanstack/react-query';

import { fetchTasks } from '../api/tasks-api';
import { STALE_TIME } from '../constants/staleTime';
import { useAuthStore } from '../store/authStore';
import { Task } from '../types/shared';

export const useTasks = (listId: string | null) => {
  const token = useAuthStore((state) => state.token);

  const { data, isLoading } = useQuery({
    queryFn: fetchTasks(token, listId as string),
    queryKey: ['tasks', listId],
    enabled: !!token && !!listId,
    staleTime: STALE_TIME,
  });

  return { tasks: data as Task[], isLoading };
};
