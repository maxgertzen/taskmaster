import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchLists } from '../api';
import { List } from '../types/shared';

export const useLists = () => {
  const { data, isError } = useSuspenseQuery({
    queryKey: ['lists'],
    queryFn: fetchLists,
  });

  return { lists: data as List[], isError };
};
