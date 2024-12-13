import { FC } from 'react';

import { useTaskStore, useViewportStore } from '../../store/store';
import { TaskInput } from '../TaskInput/TaskInput';

interface SearchbarProps {
  selectedListId: string | null;
  onSearchCallback: () => void;
}

export const Searchbar: FC<SearchbarProps> = ({
  selectedListId,
  onSearchCallback,
}) => {
  const searchTerm = useTaskStore((state) => state.searchTerm);
  const setSearchTerm = useTaskStore((state) => state.setSearchTerm);

  const isMobile = useViewportStore((state) => state.isMobile);

  const handleSearch = (text: string) => {
    onSearchCallback();
    setSearchTerm(text);
  };

  const handleReset = () => {
    if (selectedListId) {
      setSearchTerm('');
    }
  };

  return (
    <TaskInput
      isSearch
      withToggle={isMobile}
      value={searchTerm}
      onReset={handleReset}
      onSubmit={handleSearch}
    />
  );
};
