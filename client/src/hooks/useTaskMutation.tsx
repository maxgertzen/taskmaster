import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { createTask, deleteTask, reorderTasks, updateTask } from '../api';
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
};

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
        completed: input.completed || false,
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

      const queryKey = ['tasks', listId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData(queryKey, (oldTasks: Task[] = []) =>
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
        queryClient.setQueryData(['tasks', listId], context.previousTasks);
      }
    },
    [queryClient]
  );

  const handleOnSettled = useCallback(
    async (
      _data: Task | undefined,
      _error: Error | null,
      input: TaskMutationInput
    ) => {
      const listId = input.listId || input.taskId;
      await queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
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
      const listId = input.listId;
      const queryKey = ['tasks', listId];

      queryClient.setQueryData(queryKey, () => data);
    },
  });

  return {
    addTask,
    editTask,
    deleteTask: deleteTaskMutation,
    reorderTask,
  };
};
