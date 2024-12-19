import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/shared/api/query-keys';
import { useAuthStore } from '@/shared/store/authStore';
import { SearchResults } from '@/shared/types/shared';

import { fetchSearchResults } from '../api';

export const useSearchTasks = (search?: string) => {
  const token = useAuthStore((state) => state.token);

  const searchQuery = useQuery({
    queryFn: fetchSearchResults(token),
    queryKey: QUERY_KEYS.tasks({ search, listId: '' }),
    enabled: !!token && !!search,
  });

  return {
    searchResults: searchQuery.data as SearchResults,
    isError: searchQuery.isError,
  };
};
