import {
  CreateTaskRequest,
  DeleteTaskRequest,
  ReorderTasksRequest,
  UpdateTaskRequest,
} from '../types/requests';
import { Task } from '../types/shared';
import { fetcher } from '../utils/fetcher';

const TASKS_API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

export const fetchTasks =
  (token: string | null, listId: string) => async (): Promise<Task[]> => {
    return await fetcher<Task[]>({
      url: `${TASKS_API_URL}/${listId}`,
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
  async (id: string, updates: Partial<Task>): Promise<void> => {
    return await fetcher<void, UpdateTaskRequest>({
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
  async (taskId: string, listId: string): Promise<string> => {
    return await fetcher<Task['id'], DeleteTaskRequest>({
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
