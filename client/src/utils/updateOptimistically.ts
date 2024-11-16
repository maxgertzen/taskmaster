import { reorderArray } from './reorderArray';

type ReorderInput = {
  oldIndex: number;
  newIndex: number;
};

export type OptimisticUpdateInput<T> = Partial<T> & {
  id?: string;
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
        id: Date.now().toString(),
        ...newItemDefaults,
        ...input,
      } as T;
      return [...oldItems, newItem];
    }
    case 'edit': {
      if (!input.id) return oldItems;
      return oldItems.map((item) =>
        item.id === input.id ? { ...item, ...input } : item
      );
    }
    case 'delete': {
      if (!input.id) return oldItems;
      return oldItems.filter((item) => item.id !== input.id);
    }
    case 'reorder': {
      const { oldIndex, newIndex } = input;
      if (oldIndex === undefined || newIndex === undefined) return oldItems;
      return reorderArray(oldItems, oldIndex, newIndex);
    }
    default:
      return oldItems;
  }
};
