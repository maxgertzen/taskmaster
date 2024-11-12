import { useMutation, useQueryClient } from '@tanstack/react-query';

import { mockAddTask, mockEditTask, mockDeleteTask } from '../api/api';
import { Task } from '../types/shared';

type TaskOperation = 'add' | 'edit' | 'delete';

type TaskMutationInput = {
  listId: string | null;
  taskId?: string;
  text?: string;
  completed?: boolean;
};

export const useTasksMutation = (operation: TaskOperation) => {
  const queryClient = useQueryClient();

  const mutationFn = async (input: TaskMutationInput) => {
    const { listId, taskId, text, completed } = input;
    if (operation === 'add' && listId && text) {
      return mockAddTask(listId, text);
    }
    if (operation === 'edit' && taskId && text) {
      return mockEditTask(taskId, listId, { text, completed });
    }
    if (operation === 'delete' && taskId) {
      return mockDeleteTask(taskId, listId || '');
    }
  };

  return useMutation({
    mutationFn,
    onMutate: async (input) => {
      const listId = input.listId || input.taskId;
      if (!listId && operation !== 'delete') return;

      const queryKey = ['tasks', listId];
      await queryClient.cancelQueries({ queryKey });

      const previousTasks = queryClient.getQueryData<Task[]>(queryKey);

      queryClient.setQueryData(queryKey, (oldTasks: Task[] = []) => {
        switch (operation) {
          case 'add':
            return [
              ...oldTasks,
              {
                id: Date.now().toString(),
                text: input.text || '',
                completed: false,
              },
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
          default:
            return oldTasks;
        }
      });

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
      if (listId)
        queryClient.invalidateQueries({ queryKey: ['tasks', listId] });
    },
  });
};
