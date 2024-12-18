export const QUERY_KEYS = {
  lists: [{ scope: 'lists' }] as const,
  tasks: ({ listId, search }: { listId: string; search?: string }) =>
    [
      {
        scope: 'tasks',
        listId,
        ...(search && { search }),
      },
    ] as const,
};
