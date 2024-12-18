import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';

import {
  createList,
  deleteList,
  reorderLists,
  updateList,
} from '../api/lists-api';
import { QUERY_KEYS } from '../api/query-keys';
import { useAuthStore } from '../store/authStore';
import { List } from '../types/shared';
import { debounce } from '../utils/debounce';
import {
  getRealId,
  onErrorShared,
  onMutateShared,
  onSettledShared,
  replaceTemporaryId,
} from '../utils/mutationHelpers';
import { updateOptimistically } from '../utils/updateOptimistically';

type ListMutationInput = {
  listId?: string;
  name?: string;
  orderedIds?: string[];
  orderObject?: {
    oldIndex: number;
    newIndex: number;
  };
};

// TODO:
// - Handle errors and rollback changes if needed (show Alert)
export const useListsMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const reorderingInProgressRef = useRef(false);

  const debouncedReorderList = useMemo(() => {
    return debounce(async (orderedIds: string[]) => {
      try {
        reorderingInProgressRef.current = true;
        await reorderLists(token)(orderedIds);
      } finally {
        reorderingInProgressRef.current = false;
      }
    }, 1000);
  }, [token]);

  const addList = useMutation({
    mutationFn: async (input: ListMutationInput) => {
      if (input.name) {
        return createList(token)(input.name);
      }
    },
    onMutate: async (input) => {
      return onMutateShared<List>({
        input,
        queryKey: QUERY_KEYS.lists,
        queryClient,
        operation: 'add',
        newItemDefaults: { name: input.name },
      });
    },
    onSuccess: (data, variables, context) => {
      replaceTemporaryId<List>({
        tempId: context?.tempId || variables.listId || '',
        realId: data?.id || '',
        queryKey: QUERY_KEYS.lists,
        queryClient,
      });
    },
    onError: (_err, _var, context) =>
      onErrorShared<List>({
        queryKey: QUERY_KEYS.lists,
        queryClient,
        context,
      }),
    onSettled: () => {
      onSettledShared({
        queryKey: QUERY_KEYS.lists,
        queryClient,
      });
    },
  });

  const editList = useMutation({
    mutationFn: async (input: { listId: string; name: string }) => {
      const realId = getRealId({
        id: input.listId,
        queryKey: QUERY_KEYS.lists,
        queryClient,
      });

      return updateList(token)(realId, input.name);
    },
    onMutate: async (input) =>
      onMutateShared<List>({
        input,
        queryKey: QUERY_KEYS.lists,
        queryClient,
        operation: 'edit',
      }),
    onError: (_err, _var, context) =>
      onErrorShared<List>({
        queryKey: QUERY_KEYS.lists,
        queryClient,
        context,
      }),
    onSettled: () =>
      onSettledShared({
        queryKey: QUERY_KEYS.lists,
        queryClient,
      }),
  });

  const deleteListMutation = useMutation({
    mutationFn: async (input: { listId: string }) => {
      const realId = getRealId({
        id: input.listId,
        queryKey: QUERY_KEYS.lists,
        queryClient,
      });
      return deleteList(token)(realId);
    },
    onMutate: async (input) =>
      onMutateShared<List>({
        input: { ...input, id: input.listId },
        queryKey: QUERY_KEYS.lists,
        queryClient,
        operation: 'delete',
      }),
    onError: (_err, _var, context) =>
      onErrorShared<List>({
        queryKey: QUERY_KEYS.lists,
        queryClient,
        context,
      }),
    onSettled: () =>
      onSettledShared({
        queryKey: QUERY_KEYS.lists,
        queryClient,
      }),
  });

  const reorderListsMutation = useMutation({
    mutationFn: async ({
      oldIndex,
      newIndex,
    }: {
      oldIndex: number;
      newIndex: number;
    }) => {
      const previousLists = queryClient.getQueryData<List[]>(QUERY_KEYS.lists);
      if (!previousLists) return;

      const reorderedLists = updateOptimistically<List>(
        'reorder',
        { reorderingObject: { oldIndex, newIndex } },
        previousLists
      );

      const newOrderedIds = reorderedLists.map((list) => list.id);

      debouncedReorderList(newOrderedIds);

      return reorderedLists;
    },
    onMutate: async ({
      oldIndex,
      newIndex,
    }: {
      oldIndex: number;
      newIndex: number;
    }) => {
      return onMutateShared<List>({
        input: { reorderingObject: { oldIndex, newIndex } },
        queryKey: QUERY_KEYS.lists,
        queryClient,
        operation: 'reorder',
      });
    },
    onError: (_err, _variables, context) =>
      onErrorShared<List>({
        queryKey: QUERY_KEYS.lists,
        queryClient,
        context,
      }),
  });

  return {
    addList,
    editList,
    deleteList: deleteListMutation,
    reorderList: reorderListsMutation,
  };
};
