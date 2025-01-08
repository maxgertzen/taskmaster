import type { Filters, Sort } from '@/shared/types/mutations';
import type { List, Task, SearchResults } from '@/shared/types/shared';

export interface TasksApi {
  getTasks: (params: {
    listId: string | null;
    filter: Filters;
    sort: Sort;
  }) => Promise<Task[]>;

  addTask: (params: { listId: string | null; text: string }) => Promise<Task>;

  editTask: (params: {
    id: string;
    listId: string | null;
    text?: string;
    completed?: boolean;
  }) => Promise<Task>;

  deleteTask: (params: { id: string; listId: string | null }) => Promise<void>;

  reorderTask: (params: {
    listId: string | null;
    reorderingObject: {
      oldIndex: number;
      newIndex: number;
    };
  }) => Promise<void>;

  toggleComplete: (params: {
    listId: string | null;
    completed: boolean;
  }) => Promise<void>;

  bulkDelete: (params: {
    listId: string | null;
    deleteMode?: 'completed';
  }) => Promise<void>;

  searchTasks: (query: string) => Promise<SearchResults>;
}

export interface ListsApi {
  getLists: () => Promise<List[]>;

  addList: (params: { name: string }) => Promise<List>;

  editList: (params: { listId: string; name: string }) => Promise<List>;

  deleteList: (params: { listId: string }) => Promise<void>;

  reorderList: (params: {
    oldIndex: number;
    newIndex: number;
  }) => Promise<void>;
}
