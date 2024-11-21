export type MutationOperation =
  | 'add'
  | 'edit'
  | 'delete'
  | 'reorder'
  | 'toggle-complete'
  | 'delete-all';

export type Filters = 'completed' | 'incomplete' | null;

export type Sort = 'asc' | 'desc' | null;
