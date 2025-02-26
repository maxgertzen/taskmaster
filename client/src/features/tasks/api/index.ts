import { QueryFunctionContext } from '@tanstack/react-query';

import { API_URL } from '@/constants';
import { QUERY_KEYS } from '@/shared/api/query-keys';
import {
  CompleteAllRequest,
  CreateTaskRequest,
  DeleteAllRequest,
  DeleteTaskRequest,
  ReorderTasksRequest,
  UpdateTaskRequest,
} from '@/shared/types/requests';
import { SearchResults, Task } from '@/shared/types/shared';
import { fetcher } from '@/shared/utils/fetcher';

const TASKS_API_URL = `${API_URL}/tasks`;

export const fetchTasks =
  (token: string | null) =>
  async ({
    queryKey: [{ listId, search }],
  }: QueryFunctionContext<ReturnType<typeof QUERY_KEYS.tasks>>): Promise<
    Task[]
  > => {
    return await fetcher<Task[]>({
      url: `${TASKS_API_URL}/${listId}`,
      urlSearchParams: {
        ...(search && { search }),
      },
      token,
    });
  };

export const fetchSearchResults =
  (token: string | null) =>
  async ({
    queryKey: [{ search }],
  }: QueryFunctionContext<
    ReturnType<typeof QUERY_KEYS.tasks>
  >): Promise<SearchResults> => {
    if (!search) return [];

    return await fetcher<SearchResults>({
      url: `${TASKS_API_URL}/search`,
      urlSearchParams: {
        search,
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
  async (listId: string, orderedIds: string[]): Promise<Task[]> => {
    return await fetcher<Task[], ReorderTasksRequest>({
      url: `${TASKS_API_URL}/reorder`,
      method: 'POST',
      body: { listId, orderedIds },
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
