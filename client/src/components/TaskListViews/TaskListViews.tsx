import { FC } from 'react';

import { Filters, Sort } from '../../types/mutations';
import { Button } from '../Button/Button';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';

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
        variant='primary'
        onClick={() => {
          onFilter(null);
          onSort(null);
        }}
      >
        All
      </Button>
      <Button
        variant='primary'
        isActive={filter === 'incomplete'}
        onClick={() => onFilter('incomplete')}
      >
        Active
      </Button>
      <Button
        variant='success'
        isActive={filter === 'completed'}
        onClick={() => onFilter('completed')}
      >
        Completed
      </Button>
      <SpriteIcon
        name='z2a'
        alt='filter'
        onClick={() => onSort('desc')}
        isVisible={sort === 'desc'}
      />
      <SpriteIcon
        name='a2z'
        alt='filter'
        onClick={() => onSort('asc')}
        isVisible={sort === 'asc'}
      />
    </TaskListViewsContainer>
  );
};
