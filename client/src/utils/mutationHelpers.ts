import { QueryClient } from '@tanstack/react-query';

import { MutationOperation } from '../types/mutations';

import { generateTempId } from './tempId';
import { updateOptimistically } from './updateOptimistically';

export const handleOptimisticUpdate = <
  T extends { id: string; orderedIds?: string[] },
>({
  operation,
  input,
  queryKey,
  queryClient,
  newItemDefaults,
}: {
  operation: MutationOperation;
  input: Partial<T>;
  queryKey: readonly object[];
  queryClient: QueryClient;
  newItemDefaults?: Partial<T>;
}) => {
  const tempId = operation === 'add' ? generateTempId() : undefined;

  queryClient.cancelQueries({ queryKey });

  const previousData = queryClient.getQueryData<T[]>(queryKey);

  queryClient.setQueryData(queryKey, (oldData: T[] = []) =>
    updateOptimistically(
      operation,
      { ...input, id: tempId },
      oldData,
      newItemDefaults
    )
  );

  return { tempId, previousData };
};

export const replaceTemporaryId = <T extends { id: string }>({
  tempId,
  realId,
  queryKey,
  queryClient,
}: {
  tempId: string;
  realId: string;
  queryKey: readonly object[];
  queryClient: QueryClient;
}) => {
  queryClient.setQueryData(queryKey, (oldData: T[] = []) =>
    oldData.map((item) => (item.id === tempId ? { ...item, id: realId } : item))
  );

  queryClient.setQueryData<Record<string, string>>(
    [...queryKey, { idMap: true }],
    (map = {}) => ({
      ...map,
      [tempId]: realId,
    })
  );
};

export const onMutateShared = async <
  T extends {
    id: string;
  },
>({
  input,
  queryKey,
  queryClient,
  operation,
  newItemDefaults,
}: {
  input: Partial<
    T & {
      reorderingObject?: {
        oldIndex: number;
        newIndex: number;
      };
    }
  >;
  queryKey: readonly object[];
  queryClient: QueryClient;
  operation: MutationOperation;
  newItemDefaults?: Partial<T>;
}) => {
  return handleOptimisticUpdate<T>({
    operation,
    input,
    queryKey,
    queryClient,
    newItemDefaults,
  });
};

export const onErrorShared = <T>({
  queryKey,
  queryClient,
  context,
}: {
  queryKey: readonly object[];
  queryClient: QueryClient;
  context?: { tempId?: string; previousData?: T[] };
}) => {
  if (context?.previousData) {
    queryClient.setQueryData(queryKey, context.previousData);
  }
};

export const onSettledShared = ({
  queryKey,
  queryClient,
}: {
  queryKey: readonly object[];
  queryClient: QueryClient;
}) => {
  queryClient.invalidateQueries({ queryKey });
};

export const getRealId = ({
  id,
  queryKey,
  queryClient,
}: {
  id?: string;
  queryKey: readonly object[];
  queryClient: QueryClient;
}) => {
  const idMap = queryClient.getQueryData<Record<string, string>>([
    ...queryKey,
    { idMap: true },
  ]);

  return idMap?.[id || ''] || id || '';
};
