import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchMockTasks } from '../api/api';

export const useTasks = (listId: string | null) => {
  const { data } = useSuspenseQuery({
    queryKey: ['tasks', listId],
    queryFn: () => {
      if (!listId) {
        return Promise.resolve([]);
      }

      return fetchMockTasks(listId);
    },
  });

  return { tasks: data };
};
