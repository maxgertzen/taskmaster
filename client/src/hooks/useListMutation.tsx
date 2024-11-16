import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import {
  createList,
  deleteList,
  reorderLists,
  updateList,
} from '../api/lists-api';
import { useAuthStore } from '../store/authStore';
import { MutationOperation } from '../types/mutations';
import { List } from '../types/shared';
import {
  updateOptimistically,
  OptimisticUpdateInput,
} from '../utils/updateOptimistically';

type ListMutationInput = {
  listId?: string;
  name?: string;
  reorderingObject?: {
    oldIndex: number;
    newIndex: number;
  };
};

// TODO:
// - Handle errors and rollback changes if needed (show Alert)
export const useListsMutation = () => {
  const queryClient = useQueryClient();

  const token = useAuthStore((state) => state.token);

  const updateListsOptimistically = useCallback(
    (
      operation: MutationOperation,
      input: OptimisticUpdateInput<List>,
      oldLists: List[] = []
    ) =>
      updateOptimistically(operation, input, oldLists, {
        name: input.name || '',
      }),
    []
  );

  const handleOnMutate = useCallback(
    async (
      operation: MutationOperation,
      input: OptimisticUpdateInput<List>
    ) => {
      await queryClient.cancelQueries({ queryKey: ['lists'] });
      const previousLists = queryClient.getQueryData<List[]>(['lists']);

      queryClient.setQueryData(['lists'], (oldLists: List[] = []) =>
        updateListsOptimistically(operation, input, oldLists)
      );

      return { previousLists };
    },
    [queryClient, updateListsOptimistically]
  );

  const handleOnError = useCallback(
    (
      _err: Error,
      _input: ListMutationInput,
      context:
        | {
            previousLists: List[] | undefined;
          }
        | undefined
    ) => {
      if (context?.previousLists) {
        queryClient.setQueryData(['lists'], context.previousLists);
      }
    },
    [queryClient]
  );

  const handleOnSettled = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['lists'] });
  }, [queryClient]);

  const addList = useMutation({
    mutationFn: async (input: ListMutationInput) => {
      if (input.name) {
        return createList(token)(input.name);
      }
    },
    onMutate: async (input) => {
      return handleOnMutate('add', input);
    },
    onError: handleOnError,
    onSettled: handleOnSettled,
  });

  const editList = useMutation({
    mutationFn: async (input: ListMutationInput) => {
      if (input.listId && input.name) {
        return updateList(token)(input.listId, input.name);
      }
    },
    onMutate: async (input) => {
      return handleOnMutate('edit', input);
    },
    onError: handleOnError,
    onSettled: handleOnSettled,
  });

  const deleteListMutation = useMutation({
    mutationFn: async (input: ListMutationInput) => {
      if (input.listId) {
        return deleteList(token)(input.listId);
      }
    },
    onMutate: async (input) => {
      return handleOnMutate('delete', input);
    },
    onError: handleOnError,
    onSettled: handleOnSettled,
  });

  const reorderList = useMutation({
    mutationFn: async (input: ListMutationInput) => {
      if (
        input.reorderingObject?.newIndex !== undefined &&
        input.reorderingObject?.oldIndex !== undefined
      ) {
        return reorderLists(token)(
          input.reorderingObject.oldIndex,
          input.reorderingObject.newIndex
        );
      }
    },
    onMutate: async (input) => {
      return handleOnMutate('reorder', input);
    },
    onError: handleOnError,
    onSettled: handleOnSettled,
  });

  return {
    addList,
    editList,
    deleteList: deleteListMutation,
    reorderList,
  };
};
