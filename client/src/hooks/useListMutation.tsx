// src/hooks/useListsMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  mockAddList,
  mockEditList,
  mockDeleteList,
  mockReorderLists,
} from '../api/api';
import { List } from '../types/shared';
import { reorderArray } from '../utils/reorderArray';

type ListOperation = 'add' | 'edit' | 'delete' | 'reorder';

type ListMutationInput = {
  listId?: string;
  name?: string;
  reorderingObject?: {
    oldIndex: number;
    newIndex: number;
  };
};

// const debouncedReorder = debounce(
//   async (oldIndex: number, newIndex: number) => {
//     return mockReorderLists(oldIndex, newIndex);
//   },
//   1500
// );

const handleAddList = async (name: string) => {
  return mockAddList(name);
};

const handleEditList = async (listId: string, name: string) => {
  return mockEditList(listId, name);
};

const handleDeleteList = async (listId: string) => {
  return mockDeleteList(listId);
};

const mutationFunctions = {
  add: handleAddList,
  edit: handleEditList,
  delete: handleDeleteList,
};

const updateListsOptimistically = (
  operation: ListOperation,
  input: ListMutationInput,
  oldLists: List[] = []
) => {
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
    case 'reorder':
      if (
        input.reorderingObject?.oldIndex !== undefined &&
        input.reorderingObject?.newIndex !== undefined
      ) {
        return reorderArray(
          oldLists,
          input.reorderingObject.oldIndex,
          input.reorderingObject.newIndex
        );
      }
      return oldLists;
    default:
      return oldLists;
  }
};

export const useListsMutation = (operation: ListOperation) => {
  const queryClient = useQueryClient();

  const mutationFn = async (input: ListMutationInput) => {
    const { listId, name, reorderingObject } = input;
    if (
      operation === 'reorder' &&
      reorderingObject?.newIndex !== undefined &&
      reorderingObject?.oldIndex !== undefined
    ) {
      return mockReorderLists(
        reorderingObject.oldIndex,
        reorderingObject.newIndex
      );
    }
    if (operation === 'add' && name) {
      return mutationFunctions[operation](name);
    }
    if (operation === 'edit' && listId && name) {
      return mutationFunctions[operation](listId, name);
    }
    if (operation === 'delete' && listId) {
      return mutationFunctions[operation](listId);
    }
  };

  return useMutation({
    mutationFn,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ['lists'] });

      const previousLists = queryClient.getQueryData<List[]>(['lists']);

      queryClient.setQueryData(['lists'], (oldLists: List[] = []) => {
        updateListsOptimistically(operation, input, oldLists);
      });

      return { previousLists };
    },
    onError: (_error, _input, context) => {
      if (context?.previousLists) {
        queryClient.setQueryData(['lists'], context.previousLists);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
};
