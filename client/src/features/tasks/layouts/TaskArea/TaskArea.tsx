import { FC, Fragment, useMemo } from 'react';

import { useAuthStore } from '@/shared/store/authStore';
import { useDashboardStore } from '@/shared/store/dashboardStore';
import { useViewportStore } from '@/shared/store/viewportStore';
import { List } from '@/shared/types/shared';

import { SearchResults } from '../../components';
import { StyledTaskItemContainer } from '../../components/TaskItem/TaskItem.styled';
import { WelcomeMessage } from '../../components/WelcomeMessage/WelcomeMessage';
import { useSearchTasks } from '../../hooks/useSearchTasks';
import { TaskManager } from '../../managers/TaskManager';

import { TaskAreaContainer } from './TaskArea.styled';

interface TaskAreaProps {
  selectedList: List | null;
}

export const TaskArea: FC<TaskAreaProps> = ({ selectedList }) => {
  const { searchTerm, setSelectedList } = useDashboardStore((state) => state);
  const { searchResults } = useSearchTasks(searchTerm);
  const user = useAuthStore((state) => state.user);
  const isMobile = useViewportStore((state) => state.isMobile);

  const results = useMemo(() => {
    return searchResults
      ? searchResults?.map(({ listName, tasks }, index) => (
          <Fragment key={index}>
            <h2>{listName}</h2>
            <ul>
              {tasks.map((task, idx) => (
                <StyledTaskItemContainer
                  key={idx}
                  onClick={() =>
                    setSelectedList({ id: task.listId ?? '', name: listName })
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <span>{task.text}</span>
                </StyledTaskItemContainer>
              ))}
            </ul>
          </Fragment>
        ))
      : null;
  }, [searchResults, setSelectedList]);

  return (
    <TaskAreaContainer>
      {selectedList ? (
        <TaskManager list={selectedList} />
      ) : searchTerm ? (
        <SearchResults results={results} searchTerm={searchTerm} />
      ) : (
        <WelcomeMessage name={user?.name} isMobile={isMobile} />
      )}
    </TaskAreaContainer>
  );
};
