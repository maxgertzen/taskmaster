import { FC, Fragment, useMemo } from 'react';

import { useSearchTasks } from '../../hooks/useSearchTasks';
import { useTaskStore, useUserStore } from '../../store/store';
import { StyledTaskItemContainer } from '../TaskItem/TaskItem.styled';
import { Title } from '../Title/Title';

export const TaskSearchResults: FC = () => {
  const { searchResults } = useSearchTasks();
  const setListId = useTaskStore((state) => state.setSelectedListId);
  const searchTerm = useTaskStore((state) => state.searchTerm);
  const { name } = useUserStore((state) => state.user);

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
    <>
      <Title variant='h4'>
        Hi {name ?? ''}! Ready to get on top of your to-do’s?
      </Title>
      <p>
        <br /> To get started,{' '}
        <b>add a list via the plus icon next to 'lists'.</b>
      </p>
      <p>
        Whether it's your weekly shopping, Sunday cleaning itinerary, or the
        next steps of your latest project, you'll never miss out again.
      </p>
      <p>Select a list to view tasks or search for a task in the search bar</p>
    </>
  ) : (
    <div>
      <h1>Search Results</h1>
      <p>Search term: {searchTerm}</p>
      {results}
    </div>
  );
};
