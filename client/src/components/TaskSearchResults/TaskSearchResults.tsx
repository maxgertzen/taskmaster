import { FC, Fragment, useMemo } from 'react';

import { useSearchTasks } from '../../hooks/useSearchTasks';
import { useTaskStore } from '../../store/store';
import { StyledTaskItemContainer } from '../TaskItem/TaskItem.styled';
import { Title } from '../Title/Title';

export const TaskSearchResults: FC = () => {
  const { searchResults } = useSearchTasks();
  const setListId = useTaskStore((state) => state.setSelectedListId);
  const searchTerm = useTaskStore((state) => state.searchTerm);

  const results = useMemo(() => {
    return searchResults
      ? searchResults?.map(({ listName, tasks }, index) => (
          <Fragment key={index}>
            <h2>{listName}</h2>
            <ul>
              {tasks.map((task, idx) => (
                <StyledTaskItemContainer
                  key={idx}
                  onClick={() => setListId(task.listId ?? '')}
                >
                  <span>{task.text}</span>
                </StyledTaskItemContainer>
              ))}
            </ul>
          </Fragment>
        ))
      : null;
  }, [searchResults, setListId]);

  return !searchTerm ? (
    <Title variant='h4'>
      Select a list to view tasks or search for a task in the search bar
    </Title>
  ) : (
    <div>
      <h1>Search Results</h1>
      <p>Search term: {searchTerm}</p>
      {results}
    </div>
  );
};
