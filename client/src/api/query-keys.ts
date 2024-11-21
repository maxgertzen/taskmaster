import { Filters, Sort } from '../types/mutations';

export const QUERY_KEYS = {
  lists: ['lists'] as const,
  tasks: ({
    listId,
    filter,
    sort,
  }: {
    listId: string | null;
    filter?: Filters;
    sort?: Sort;
  }) => {
    const baseKey = ['tasks', listId] as const;
    const filterKey = filter ? [filter] : [];
    const sortKey = sort ? [sort] : [];
    return [...baseKey, ...filterKey, ...sortKey] as const;
  },
};
