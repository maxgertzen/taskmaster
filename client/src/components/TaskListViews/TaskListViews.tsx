import { FC } from 'react';

import { Filters, Sort } from '../../types/mutations';
import { Button } from '../Button/Button';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

import { TaskListViewsContainer } from './TaskListViews.styled';

interface TaskListViewsProps {
  isAllCompleted: boolean;
  onAdd: (text: string) => void;
  onCompleteAll: () => void;
  onToggleCompleted: () => void;
  onDeleteAll: () => void;
  onFilter: (filter?: Filters) => void;
  onSort: (sort: Sort) => void;
}

export const TaskListViews: FC<TaskListViewsProps> = ({ onFilter, onSort }) => {
  return (
    <TaskListViewsContainer>
      <Button variant='outline' onClick={() => onFilter()}>
        All
      </Button>
      <Button variant='outline' onClick={() => onFilter('incomplete')}>
        Active
      </Button>
      <Button variant='outline' onClick={() => onFilter('completed')}>
        Completed
      </Button>
      <FaIcon icon={['fas', 'arrow-up-a-z']} onClick={() => onSort('desc')} />
      <FaIcon icon={['fas', 'arrow-down-a-z']} onClick={() => onSort('asc')} />
    </TaskListViewsContainer>
  );
};
