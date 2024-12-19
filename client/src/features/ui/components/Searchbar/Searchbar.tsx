import { FC } from 'react';

import { useDashboardStore } from '@/shared/store/dashboardStore';
import { useViewportStore } from '@/shared/store/viewportStore';

import { Input } from '..';

interface SearchbarProps {
  placeholder: string;
  selectedListId?: string | null;
  onSearchCallback: () => void;
}

export const Searchbar: FC<SearchbarProps> = ({
  placeholder,
  selectedListId,
  onSearchCallback,
}) => {
  const { searchTerm, setSearchTerm } = useDashboardStore((state) => state);

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
    <Input
      placeholder={placeholder}
      isSearch
      withToggle={isMobile}
      value={searchTerm}
      onReset={handleReset}
      onSubmit={handleSearch}
    />
  );
};
