import {
  DeleteListRequest,
  ReorderListRequest,
  UpdateListRequest,
} from '../types/requests';
import { List } from '../types/shared';
import { fetcher } from '../utils/fetcher';

const LISTS_API_URL = `${import.meta.env.VITE_API_URL}/lists`;

export const fetchLists = async (): Promise<List[]> => {
  return await fetcher<List[]>({
    url: LISTS_API_URL,
  });
};

export const reorderLists = async (
  oldIndex: number,
  newIndex: number
): Promise<List[]> => {
  return await fetcher<List[], ReorderListRequest>({
    url: `${LISTS_API_URL}/reorder`,
    method: 'POST',
    body: { oldIndex, newIndex },
  });
};

export const createList = async (name: string): Promise<List> => {
  return await fetcher<List, { name: string }>({
    url: LISTS_API_URL,
    method: 'POST',
    body: { name },
  });
};

export const updateList = async (id: string, name: string): Promise<List> => {
  return await fetcher<List, UpdateListRequest>({
    url: LISTS_API_URL,
    method: 'PUT',
    body: { id, name },
  });
};

export const deleteList = async (id: string): Promise<string> => {
  return await fetcher<string, DeleteListRequest>({
    url: LISTS_API_URL,
    method: 'DELETE',
    body: { id },
  });
};
