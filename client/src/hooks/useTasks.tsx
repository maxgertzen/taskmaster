import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchTasks } from '../api/tasks-api';
import { Task } from '../types/shared';

export const useTasks = (listId: string) => {
  const { data } = useSuspenseQuery({
    queryKey: ['tasks', listId],
    queryFn: fetchTasks(listId),
  });

  return { tasks: data as Task[] };
};
