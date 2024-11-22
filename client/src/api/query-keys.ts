import { Filters, Sort } from '../types/mutations';

export const QUERY_KEYS = {
  lists: [{ scope: 'lists' }] as const,
  tasks: ({
    listId,
    filter,
    sort,
  }: {
    listId: string;
    filter?: Filters;
    sort?: Sort;
  }) =>
    [
      {
        scope: 'tasks',
        listId,
        ...(filter && { filter }),
        ...(sort && { sort }),
      },
    ] as const,
};
