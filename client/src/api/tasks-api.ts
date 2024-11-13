import {
  CreateTaskRequest,
  DeleteTaskRequest,
  ReorderTasksRequest,
  UpdateTaskRequest,
} from '../types/requests';
import { Task } from '../types/shared';
import { fetcher } from '../utils/fetcher';

const TASKS_API_URL = `${import.meta.env.VITE_API_URL}/tasks`;

export const fetchTasks = (listId: string) => async (): Promise<Task[]> => {
  return await fetcher<Task[]>({
    url: `${TASKS_API_URL}/${listId}`,
  });
};

export const createTask = async (
  listId: string,
  text: string
): Promise<Task> => {
  return await fetcher<Task, CreateTaskRequest>({
    url: `${TASKS_API_URL}/create`,
    method: 'POST',
    body: { listId, text },
  });
};

export const updateTask = async (
  id: string,
  updates: Partial<Task>
): Promise<void> => {
  return await fetcher<void, UpdateTaskRequest>({
    url: TASKS_API_URL,
    method: 'PUT',
    body: {
      id,
      ...updates,
    },
  });
};

export const deleteTask = async (
  taskId: string,
  listId: string
): Promise<string> => {
  return await fetcher<Task['id'], DeleteTaskRequest>({
    url: TASKS_API_URL,
    method: 'DELETE',
    body: { taskId, listId },
  });
};

export const reorderTasks = async (
  listId: string,
  oldIndex: number,
  newIndex: number
): Promise<Task[]> => {
  return await fetcher<Task[], ReorderTasksRequest>({
    url: `${TASKS_API_URL}/reorder`,
    method: 'POST',
    body: { listId, oldIndex, newIndex },
  });
};
