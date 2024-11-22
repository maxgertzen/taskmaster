import { FC } from 'react';

import { Filters, Sort } from '../../types/mutations';
import { Button } from '../Button/Button';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

import { TaskListViewsContainer } from './TaskListViews.styled';

interface TaskListViewsProps {
  filter: Filters;
  sort: Sort;
  onFilter: (filter: Filters) => void;
  onSort: (sort: Sort) => void;
}

export const TaskListViews: FC<TaskListViewsProps> = ({
  filter,
  sort,
  onFilter,
  onSort,
}) => {
  return (
    <TaskListViewsContainer>
      <Button
        variant={filter == null ? 'primary' : 'outline'}
        onClick={() => onFilter(null)}
      >
        All
      </Button>
      <Button
        variant={filter === 'incomplete' ? 'primary' : 'outline'}
        onClick={() => onFilter('incomplete')}
      >
        Active
      </Button>
      <Button
        variant={filter === 'completed' ? 'primary' : 'outline'}
        onClick={() => onFilter('completed')}
      >
        Completed
      </Button>
      <FaIcon
        isActive={sort === 'desc'}
        icon={['fas', 'arrow-up-a-z']}
        onClick={() => onSort('desc')}
      />
      <FaIcon
        isActive={sort === 'asc'}
        icon={['fas', 'arrow-down-a-z']}
        onClick={() => onSort('asc')}
      />
    </TaskListViewsContainer>
  );
};
