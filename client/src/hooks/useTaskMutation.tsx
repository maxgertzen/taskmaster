import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';

import {
  bulkDelete,
  createTask,
  deleteTask,
  reorderTasks,
  toggleCompleteAll,
  updateTask,
} from '../api';
import { QUERY_KEYS } from '../api/query-keys';
import { useAuthStore } from '../store/authStore';
import { Task } from '../types/shared';
import { debounce } from '../utils/debounce';
import {
  getRealId,
  onErrorShared,
  onMutateShared,
  onSettledShared,
  replaceTemporaryId,
} from '../utils/mutationHelpers';
import { updateOptimistically } from '../utils/updateOptimistically';

type TaskMutationInput = {
  listId?: string | null;
  id?: string;
  text?: string;
  completed?: boolean;
  reorderingObject?: {
    oldIndex: number;
    newIndex: number;
  };
  deleteMode?: 'completed' | 'all';
};

export const useTasksMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const reorderingInProgressRef = useRef(false);

  const debouncedReorderTasks = useMemo(() => {
    return debounce(async (listId: string, orderedIds: string[]) => {
      try {
        reorderingInProgressRef.current = true;
        await reorderTasks(token)(listId, orderedIds);
      } finally {
        reorderingInProgressRef.current = false;
      }
    }, 1000);
  }, [token]);

  const addTask = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (input.text && input.listId) {
        return createTask(token)(input.listId, input.text);
      }
    },
    onMutate: async (input) =>
      onMutateShared<Task>({
        input,
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
        operation: 'add',
        newItemDefaults: { text: input.text },
      }),
    onSuccess: (data, variables, context) => {
      replaceTemporaryId<Task>({
        tempId: context?.tempId || variables.id || '',
        realId: data?.id || '',
        queryKey: QUERY_KEYS.tasks({ listId: variables.listId || '' }),
        queryClient,
      });
    },
    onError: (_err, _variables, context) =>
      onErrorShared<Task>({
        queryKey: QUERY_KEYS.tasks({
          listId: context?.previousData?.[0]?.listId || '',
        }),
        queryClient,
        context,
      }),
    onSettled: (_data, _error, input) =>
      onSettledShared({
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      }),
  });

  const editTask = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (!input.id && !input.listId) return [] as Task[];

      const realId = getRealId({
        id: input.id,
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      });

      return updateTask(token)(realId, {
        id: input.id,
        listId: input.listId,
        text: input.text,
        completed: input.completed,
      });
    },
    onMutate: async (input) =>
      onMutateShared<Task>({
        input: {
          id: input.id,
          listId: input.listId,
          text: input.text,
          completed: input.completed,
        },
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
        operation: 'edit',
        newItemDefaults: { text: input.text },
      }),
    onError: (_err, _variables, context) =>
      onErrorShared<Task>({
        queryKey: QUERY_KEYS.tasks({
          listId: context?.previousData?.[0]?.listId || '',
        }),
        queryClient,
        context,
      }),
    onSettled: (_data, _error, input) =>
      onSettledShared({
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (!input.id && !input.listId) return [] as Task[];

      const realId = getRealId({
        id: input.id,
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      });

      return deleteTask(token)(realId, input.listId || '');
    },
    onMutate: async (input) =>
      onMutateShared<Task>({
        input: { ...input, id: input.id },
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
        operation: 'delete',
      }),
    onError: (_err, _variables, context) =>
      onErrorShared<Task>({
        queryKey: QUERY_KEYS.tasks({
          listId: context?.previousData?.[0]?.listId || '',
        }),
        queryClient,
        context,
      }),
    onSettled: (_data, _error, input) =>
      onSettledShared({
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      }),
  });

  const reorderTask = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (!input.listId || !input.reorderingObject) return [] as Task[];

      const { oldIndex, newIndex } = input.reorderingObject;

      const previousTasks = queryClient.getQueryData<Task[]>(
        QUERY_KEYS.tasks({ listId: input.listId })
      );

      if (!previousTasks) return [] as Task[];

      const reorderedTasks = updateOptimistically<Task>(
        'reorder',
        { reorderingObject: { oldIndex, newIndex } },
        previousTasks
      );

      const newOrderedIds = reorderedTasks.map((task) => task.id);

      debouncedReorderTasks(input.listId, newOrderedIds);

      return reorderedTasks;
    },
    onMutate: async (input) =>
      onMutateShared<Task>({
        input: {
          reorderingObject: input.reorderingObject,
        },
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
        operation: 'reorder',
      }),
    onError: (_err, _variables, context) =>
      onErrorShared<Task>({
        queryKey: QUERY_KEYS.tasks({
          listId: context?.previousData?.[0]?.listId || '',
        }),
        queryClient,
        context,
      }),
  });

  const toggleComplete = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (!input.listId) return [] as Task[];

      const realId = getRealId({
        id: input.id,
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      });

      return toggleCompleteAll(token)(realId, input.completed || false);
    },
    onMutate: async (input) =>
      onMutateShared<Task>({
        input: { completed: input.completed || false },
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
        operation: 'toggle-complete',
      }),
    onError: (_err, _variables, context) =>
      onErrorShared<Task>({
        queryKey: QUERY_KEYS.tasks({
          listId: context?.previousData?.[0]?.listId || '',
        }),
        queryClient,
        context,
      }),
    onSettled: (_data, _error, input) =>
      onSettledShared({
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      }),
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (input.listId) {
        return bulkDelete(token)(input.listId, input.deleteMode);
      }

      const realId = getRealId({
        id: input.id,
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      });

      return deleteTask(token)(realId, input.listId || '');
    },
    onMutate: async (input) =>
      onMutateShared<Task & { deleteMode: 'completed' | 'all' }>({
        input: { deleteMode: input.deleteMode || 'all' },
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
        operation: 'delete-all',
      }),
    onError: (_err, _variables, context) =>
      onErrorShared<Task>({
        queryKey: QUERY_KEYS.tasks({
          listId: context?.previousData?.[0]?.listId || '',
        }),
        queryClient,
        context,
      }),
    onSettled: (_data, _error, input) =>
      onSettledShared({
        queryKey: QUERY_KEYS.tasks({ listId: input.listId || '' }),
        queryClient,
      }),
  });

  return {
    addTask,
    editTask,
    deleteTask: deleteTaskMutation,
    reorderTask,
    toggleComplete,
    bulkDelete: bulkDeleteMutation,
  };
};
