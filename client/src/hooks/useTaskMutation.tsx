import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

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
import { MutationOperation } from '../types/mutations';
import { Task } from '../types/shared';
import {
  updateOptimistically,
  OptimisticUpdateInput,
} from '../utils/updateOptimistically';

type TaskMutationInput = {
  listId?: string | null;
  taskId?: string;
  text?: string;
  completed?: boolean;
  reorderingObject?: {
    oldIndex: number;
    newIndex: number;
  };
  deleteMode?: 'completed' | 'all';
};

// TODO:
// - Fix optimistic updates
export const useTasksMutation = () => {
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);

  const updateTasksOptimistically = useCallback(
    (
      operation: MutationOperation,
      input: OptimisticUpdateInput<Task>,
      oldTasks: Task[] = []
    ) =>
      updateOptimistically(operation, input, oldTasks, {
        id: input.id || '',
        listId: input.listId || '',
        text: input.text || '',
        completed: input.completed,
      }),
    []
  );

  const handleOnMutate = useCallback(
    async (
      operation: MutationOperation,
      input: OptimisticUpdateInput<Task>
    ) => {
      const listId = input.listId || input.id;

      if (!listId) return;

      const queryKey = QUERY_KEYS.tasks({ listId });
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueriesData({ queryKey }, (oldTasks: Task[] = []) =>
        updateTasksOptimistically(operation, input, oldTasks)
      );

      return { previousTasks };
    },
    [queryClient, updateTasksOptimistically]
  );

  const handleOnError = useCallback(
    (
      _err: Error,
      _input: TaskMutationInput,
      context:
        | {
            previousTasks: Task[] | undefined;
          }
        | undefined
    ) => {
      const listId = context?.previousTasks?.[0]?.listId;
      if (context?.previousTasks && listId) {
        queryClient.setQueriesData(
          { queryKey: QUERY_KEYS.tasks({ listId }) },
          context.previousTasks
        );
      }
    },
    [queryClient]
  );

  const handleOnSettled = useCallback(
    (
      _data: Task | Task[] | undefined,
      _error: Error | null,
      input: TaskMutationInput
    ) => {
      const listId = input.listId || input.taskId || '';
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.tasks({ listId }),
        exact: false,
      });
    },
    [queryClient]
  );

  const addTask = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (input.text && input.listId) {
        return createTask(token)(input.listId, input.text);
      }

      return {} as Task;
    },
    onMutate: async (input) => {
      return handleOnMutate('add', input);
    },
    onError: handleOnError,
    onSettled: handleOnSettled,
  });

  const editTask = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (input.taskId && input.listId) {
        return updateTask(token)(input.taskId, {
          id: input.taskId,
          listId: input.listId,
          text: input.text,
          completed: input.completed,
        });
      }

      return {} as Task;
    },
    onMutate: async ({ taskId, listId, text, completed }) => {
      return handleOnMutate('edit', {
        id: taskId,
        listId: listId,
        ...(text ? { text: text } : {}),
        ...(completed !== undefined ? { completed: completed } : {}),
      });
    },
    onError: handleOnError,
    onSettled: handleOnSettled,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (input.taskId && input.listId) {
        return deleteTask(token)(input.taskId, input.listId);
      }

      return {} as Task;
    },
    onMutate: async (input) => {
      return handleOnMutate('delete', {
        id: input.taskId,
        listId: input.listId,
      });
    },
    onError: handleOnError,
    onSettled: handleOnSettled,
  });

  const reorderTask = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (input.listId && input.reorderingObject) {
        const { oldIndex, newIndex } = input.reorderingObject;
        return (await reorderTasks(token)(
          input.listId,
          oldIndex,
          newIndex
        )) as unknown as Task[];
      }

      return {} as Task[];
    },
    onMutate: async (input) => {
      return await handleOnMutate('reorder', input);
    },
    onError: handleOnError,
    // onSettled: handleOnSettled,
    onSuccess: (data, input) => {
      const listId = input.listId || '';
      const queryKey = QUERY_KEYS.tasks({ listId });

      queryClient.setQueriesData({ queryKey, exact: false }, () => data);
    },
  });

  const toggleComplete = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (input.listId) {
        return toggleCompleteAll(token)(input.listId, input.completed || false);
      }
    },
    onMutate: async (input) => {
      const listId = input.listId;

      if (!listId) return;

      const queryKey = QUERY_KEYS.tasks({ listId });
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData(queryKey, (oldTasks: Task[] = []) => {
        return oldTasks.map((task) => ({
          ...task,
          completed: input.completed,
        }));
      });

      return { previousTasks };
    },
    onError: handleOnError,
    onSuccess: (data, input) => {
      const listId = input.listId;
      const queryKey = QUERY_KEYS.tasks({ listId: listId || '' });

      queryClient.setQueriesData({ queryKey, exact: false }, () => data);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (input: TaskMutationInput) => {
      if (input.listId) {
        return bulkDelete(token)(input.listId, input.deleteMode);
      }

      return [] as Task[];
    },
    onMutate: async (input) => {
      const listId = input.listId;

      if (!listId) return;

      const queryKey = QUERY_KEYS.tasks({ listId });
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueriesData(
        { queryKey, exact: false },
        (oldTasks: Task[] = []) => {
          if (input.deleteMode === 'completed') {
            return oldTasks.filter((task) => !task.completed);
          }

          return [];
        }
      );

      return { previousTasks };
    },
    onError: handleOnError,
    onSuccess: (data, input) => {
      const listId = input.listId;
      const queryKey = QUERY_KEYS.tasks({ listId: listId || '' });

      queryClient.setQueriesData({ queryKey, exact: false }, () => data);
    },
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
