import { useQuery } from '@tanstack/react-query';

import { fetchSearchResults } from '../api';
import { QUERY_KEYS } from '../api/query-keys';
import { useAuthStore } from '../store/authStore';
import { useTaskStore } from '../store/store';
import { SearchResults } from '../types/shared';

export const useSearchTasks = () => {
  const token = useAuthStore((state) => state.token);
  const search = useTaskStore((state) => state.searchTerm);

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
