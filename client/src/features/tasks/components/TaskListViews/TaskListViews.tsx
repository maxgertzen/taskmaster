import { FC } from 'react';

import { SpriteIcon, Button, HighlightedArea } from '@/features/ui/components';
import { Filters, Sort } from '@/shared/types/mutations';

import {
  StyledButtonsWrapper,
  TaskListViewsContainer,
} from './TaskListViews.styled';

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
      <StyledButtonsWrapper>
        <HighlightedArea id='clear-filter'>
          <Button
            variant='primary'
            onClick={() => {
              onFilter(null);
              onSort(null);
            }}
          >
            All
          </Button>
        </HighlightedArea>
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
      </StyledButtonsWrapper>
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
