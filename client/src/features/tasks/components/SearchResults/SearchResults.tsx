import { FC, ReactNode } from 'react';

interface SearchResultsProps {
  results: ReactNode;
  searchTerm: string;
}

export const SearchResults: FC<SearchResultsProps> = ({
  results,
  searchTerm,
}) => {
  return (
    <div>
      <h1>Search Results</h1>
      <br />
      <p>Search term: {searchTerm}</p>
      {results}
    </div>
  );
};
