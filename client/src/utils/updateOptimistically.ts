import { reorderArray } from './reorderArray';

type ReorderInput = {
  reorderingObject?: {
    oldIndex: number;
    newIndex: number;
  };
};

export type OptimisticUpdateInput<T> = Partial<T> & {
  id?: string;
  listId?: string | null;
} & Partial<ReorderInput>;

export const updateOptimistically = <T extends { id: string }>(
  operation: 'add' | 'edit' | 'delete' | 'reorder',
  input: OptimisticUpdateInput<T>,
  oldItems: T[] = [],
  newItemDefaults?: Partial<T>
): T[] => {
  switch (operation) {
    case 'add': {
      if (!newItemDefaults) {
        throw new Error("Defaults must be provided for the 'add' operation");
      }
      const newItem: T = {
        id: `temp-${Date.now()}`,
        ...newItemDefaults,
        ...input,
      } as T;
      return [...oldItems, newItem];
    }
    case 'edit': {
      if (!input.id && !input.listId) return oldItems;
      const id = input.id || input.listId;
      return oldItems.map((item) =>
        item.id === id ? { ...item, ...input } : item
      );
    }
    case 'delete': {
      if (!input.id && !input.listId) return oldItems;
      const id = input.id || input.listId;
      return oldItems.filter((item) => item.id !== id);
    }
    case 'reorder': {
      const { oldIndex, newIndex } = input.reorderingObject || {};
      if (oldIndex !== undefined && newIndex !== undefined)
        return reorderArray(oldItems, oldIndex, newIndex);
      return oldItems;
    }
    default:
      return oldItems;
  }
};
