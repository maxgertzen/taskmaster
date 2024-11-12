// src/hooks/useListsMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mockAddList, mockEditList, mockDeleteList } from '../api/api';
import { List } from '../types/shared';

type ListOperation = 'add' | 'edit' | 'delete';

type ListMutationInput = {
  listId?: string;
  name?: string;
};

export const useListsMutation = (operation: ListOperation) => {
  const queryClient = useQueryClient();

  const mutationFn = async (input: ListMutationInput) => {
    if (operation === 'add' && input.name) {
      return mockAddList(input.name);
    }
    if (operation === 'edit' && input.listId && input.name) {
      return mockEditList(input.listId, input.name);
    }
    if (operation === 'delete' && input.listId) {
      return mockDeleteList(input.listId);
    }
  };

  return useMutation({
    mutationFn,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['lists', 'tasks'] });

      const previousLists = queryClient.getQueryData<List[]>(['lists']);

      queryClient.setQueryData(['lists'], (oldLists: List[] = []) => {
        switch (operation) {
          case 'add':
            return [
              ...oldLists,
              { id: Date.now().toString(), name: input.name || '' },
            ];
          case 'edit':
            return oldLists.map((list) =>
              list.id === input.listId
                ? { ...list, name: input.name || list.name }
                : list
            );
          case 'delete':
            return oldLists.filter((list) => list.id !== input.listId);
          default:
            return oldLists;
        }
      });

      return { previousLists };
    },
    onError: (_error, _input, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(['lists'], context.previousLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lists', 'tasks'] });
    },
  });
};
