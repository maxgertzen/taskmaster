import { useQuery } from '@tanstack/react-query';

import { fetchTasks } from '../api/tasks-api';
import { useAuthStore } from '../store/authStore';
import { Task } from '../types/shared';

export const useTasks = (listId: string) => {
  const token = useAuthStore((state) => state.token);

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', listId],
    queryFn: fetchTasks(token, listId),
    enabled: !!token,
  });

  return { tasks: data as Task[], isLoading };
};
