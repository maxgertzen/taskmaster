import {
  DeleteListRequest,
  ReorderListRequest,
  UpdateListRequest,
} from '@/shared/types/requests';
import { List } from '@/shared/types/shared';
import { fetcher } from '@/shared/utils/fetcher';

const LISTS_API_URL = `${import.meta.env.VITE_API_URL}/lists`;

export const fetchLists =
  (token: string | null) => async (): Promise<List[]> => {
    if (!token) {
      throw new Error('No token found');
    }
    return await fetcher<List[]>({
      url: LISTS_API_URL,
      token,
    });
  };

export const reorderLists =
  (token: string | null) =>
  async (orderedIds: string[]): Promise<List[]> => {
    if (!token) {
      throw new Error('No token found');
    }
    return await fetcher<List[], ReorderListRequest>({
      url: `${LISTS_API_URL}/reorder`,
      method: 'POST',
      body: { orderedIds },
      token,
    });
  };

export const createList =
  (token: string | null) =>
  async (name: string): Promise<List> => {
    if (!token) {
      throw new Error('No token found');
    }
    return await fetcher<List, { name: string }>({
      url: LISTS_API_URL,
      method: 'POST',
      body: { name },
      token,
    });
  };

export const updateList =
  (token: string | null) =>
  async (id: string, name: string): Promise<List> => {
    if (!token) {
      throw new Error('No token found');
    }
    return await fetcher<List, UpdateListRequest>({
      url: LISTS_API_URL,
      method: 'PUT',
      body: { id, name },
      token,
    });
  };

export const deleteList =
  (token: string | null) =>
  async (id: string): Promise<string> => {
    if (!token) {
      throw new Error('No token found');
    }
    return await fetcher<string, DeleteListRequest>({
      url: LISTS_API_URL,
      method: 'DELETE',
      body: { id },
      token,
    });
  };
