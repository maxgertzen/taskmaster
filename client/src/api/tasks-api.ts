import { QueryFunctionContext } from '@tanstack/react-query';

import {
  CompleteAllRequest,
  CreateTaskRequest,
  DeleteAllRequest,
  DeleteTaskRequest,
  ReorderTasksRequest,
  UpdateTaskRequest,
} from '../types/requests';
import { Task } from '../types/shared';
import { fetcher } from '../utils/fetcher';

import { QUERY_KEYS } from './query-keys';

const TASKS_API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

export const fetchTasks =
  (token: string | null) =>
  async ({
    queryKey: [{ listId, filter, sort }],
  }: QueryFunctionContext<ReturnType<typeof QUERY_KEYS.tasks>>): Promise<
    Task[]
  > => {
    return await fetcher<Task[]>({
      url: `${TASKS_API_URL}/${listId}`,
      urlSearchParams: {
        ...(filter && { filter }),
        ...(sort && { sort }),
      },
      token,
    });
  };

export const createTask =
  (token: string | null) =>
  async (listId: string, text: string): Promise<Task> => {
    return await fetcher<Task, CreateTaskRequest>({
      url: `${TASKS_API_URL}/create`,
      method: 'POST',
      body: { listId, text },
      token,
    });
  };

export const updateTask =
  (token: string | null) =>
  async (id: string, updates: Partial<Task>): Promise<Task> => {
    return await fetcher<Task, UpdateTaskRequest>({
      url: TASKS_API_URL,
      method: 'PUT',
      body: {
        id,
        ...updates,
      },
      token,
    });
  };

export const deleteTask =
  (token: string | null) =>
  async (taskId: string, listId: string): Promise<Task> => {
    return await fetcher<Task, DeleteTaskRequest>({
      url: TASKS_API_URL,
      method: 'DELETE',
      body: { taskId, listId },
      token,
    });
  };

export const reorderTasks =
  (token: string | null) =>
  async (
    listId: string,
    oldIndex: number,
    newIndex: number
  ): Promise<Task[]> => {
    return await fetcher<Task[], ReorderTasksRequest>({
      url: `${TASKS_API_URL}/reorder`,
      method: 'POST',
      body: { listId, oldIndex, newIndex },
      token,
    });
  };

export const toggleCompleteAll =
  (token: string | null) =>
  async (listId: string, newCompletedState: boolean): Promise<Task[]> => {
    return await fetcher<Task[], CompleteAllRequest>({
      url: `${TASKS_API_URL}/toggle-complete`,
      method: 'POST',
      body: { listId, newCompletedState },
      token,
    });
  };

export const bulkDelete =
  (token: string | null) =>
  async (listId: string, mode?: 'all' | 'completed'): Promise<Task[]> => {
    return await fetcher<Task[], DeleteAllRequest>({
      url: `${TASKS_API_URL}/bulk-delete`,
      method: 'DELETE',
      body: { listId, mode },
      token,
    });
  };
