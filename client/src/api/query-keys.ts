import { Filters, Sort } from '../types/mutations';

export const QUERY_KEYS = {
  lists: [{ scope: 'lists' }] as const,
  tasks: ({
    listId,
    filter,
    sort,
    search,
  }: {
    listId: string;
    filter?: Filters;
    sort?: Sort;
    search?: string;
  }) =>
    [
      {
        scope: 'tasks',
        listId,
        ...(filter && { filter }),
        ...(sort && { sort }),
        ...(search && { search }),
      },
    ] as const,
};
