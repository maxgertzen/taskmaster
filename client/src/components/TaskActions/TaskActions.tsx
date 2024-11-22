import { FC } from 'react';

import { AddTaskInput } from '../AddTaskInput/AddTaskInput';
import { Button } from '../Button/Button';

import { IconContainer, TaskActionsContainer } from './TaskActions.styled';

interface TaskActionsProps {
  isAllCompleted: boolean;
  isAnyCompleted: boolean;
  onAdd: (text: string) => void;
  onToggleCompleteAll: () => void;
  onDeleteAll: (mode?: 'completed') => () => void;
}

export const TaskActions: FC<TaskActionsProps> = ({
  isAllCompleted,
  isAnyCompleted,
  onAdd,
  onToggleCompleteAll,
  onDeleteAll,
}) => {
  return (
    <TaskActionsContainer>
      <AddTaskInput onAddTask={onAdd} />
      <IconContainer>
        <Button variant='outline' onClick={() => onToggleCompleteAll()}>
          {`${isAllCompleted ? 'Uncheck' : 'Check'} All`}
        </Button>
        <Button
          disabled={!isAnyCompleted}
          variant='danger'
          onClick={onDeleteAll('completed')}
        >
          Delete Completed
        </Button>
        <Button variant='danger' onClick={onDeleteAll()}>
          Delete All
        </Button>
      </IconContainer>
    </TaskActionsContainer>
  );
};