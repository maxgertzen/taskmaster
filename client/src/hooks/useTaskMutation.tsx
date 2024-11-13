import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  createTask,
  deleteTask,
  reorderTasks,
  updateTask,
} from '../api/tasks-api';
import { Task } from '../types/shared';
import { debounce } from '../utils/debounce';
import { reorderArray } from '../utils/reorderArray';

type TaskOperation = 'add' | 'edit' | 'delete' | 'reorder';

type TaskMutationInput = {
  listId: string | null;
  taskId?: string;
  text?: string;
  completed?: boolean;
  reorderingObject?: {
    oldIndex: number;
    newIndex: number;
  };
};

const debouncedReorder = debounce(
  async (listId: string, oldIndex: number, newIndex: number) => {
    return reorderTasks(listId, oldIndex, newIndex);
  },
  500
);

const handleAddTask = async (listId: string, text: string) => {
  return createTask(listId, text);
};

const handleEditTask = async (taskId: string, updates: Partial<Task>) => {
  return updateTask(taskId, updates);
};

const handleDeleteTask = async (taskId: string, listId: string) => {
  return deleteTask(taskId, listId);
};

const mutationFunctions = {
  add: handleAddTask,
  edit: handleEditTask,
  delete: handleDeleteTask,
};

const updateTasksOptimistically = (
  operation: TaskOperation,
  input: TaskMutationInput,
  oldTasks: Task[] = []
) => {
  switch (operation) {
    case 'add':
      return [
        ...oldTasks,
        { id: Date.now().toString(), text: input.text || '', completed: false },
      ];
    case 'edit':
      return oldTasks.map((t) =>
        t.id === input.taskId
          ? {
              ...t,
              text: input.text || t.text,
              completed: input.completed ?? t.completed,
            }
          : t
      );
    case 'delete':
      return oldTasks.filter((t) => t.id !== input.taskId);
    case 'reorder':
      if (
        input.reorderingObject?.oldIndex !== undefined &&
        input.reorderingObject?.newIndex !== undefined
      ) {
        return reorderArray(
          oldTasks,
          input.reorderingObject.oldIndex,
          input.reorderingObject.newIndex
        );
      }
      return oldTasks;
    default:
      return oldTasks;
  }
};

export const useTasksMutation = (operation: TaskOperation) => {
  const queryClient = useQueryClient();

  const mutationFn = async (input: TaskMutationInput) => {
    const { listId, taskId, text, completed, reorderingObject } = input;

    if (
      operation === 'reorder' &&
      listId &&
      reorderingObject?.newIndex !== undefined &&
      reorderingObject?.oldIndex !== undefined
    ) {
      return debouncedReorder(
        listId,
        reorderingObject.oldIndex,
        reorderingObject.newIndex
      );
    }

    if (operation === 'add' && listId && text)
      return mutationFunctions[operation](listId, text);
    if (operation === 'edit' && taskId && text)
      return mutationFunctions[operation](taskId, { text, completed });
    if (operation === 'delete' && taskId)
      return mutationFunctions[operation](taskId, listId || '');
  };

  return useMutation({
    mutationFn,
    onMutate: async (input) => {
      const listId = input.listId || input.taskId;
      if (!listId && operation !== 'delete') return;

      const queryKey = ['tasks', listId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData(queryKey, (oldTasks: Task[] = []) =>
        updateTasksOptimistically(operation, input, oldTasks)
      );

      return { previousTasks };
    },
    onError: (_error, _input, context) => {
      const listId = (context?.previousTasks?.[0] as Task)?.id;
      if (context?.previousTasks && listId) {
        queryClient.setQueryData(['tasks', listId], context.previousTasks);
      }
    },
    onSettled: (_data, _error, input) => {
      const listId = input.listId || input.taskId;
      if (listId && operation !== 'reorder')
        queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
    },
  });
};
