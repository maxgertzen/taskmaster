import { useSuspenseQuery } from '@tanstack/react-query';

import { fetchMockLists } from '../api/api';

export const useLists = () => {
  const { data, isError } = useSuspenseQuery({
    queryKey: ['lists'],
    queryFn: fetchMockLists,
  });

  return { lists: data, isError };
};
