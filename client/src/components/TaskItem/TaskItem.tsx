import React from 'react';

import { Task } from '../../types/shared';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

import {
  DragIconWrapper,
  Container,
  TaskItemContainer,
} from './TaskItem.styled';

interface TaskProps {
  task: Task;
}

// TODO:
// - Implement remove button that will remove the task
// - Implement edit button that will allow the user to edit the task text
// - Implement a button to mark the task as done
// - Implement a button to reorder tasks
export const TaskItem: React.FC<TaskProps> = ({ task }) => {
  return (
    <TaskItemContainer>
      <Container>
        <DragIconWrapper>
          <FaIcon icon={['fas', 'grip-vertical']} size='sm' />
        </DragIconWrapper>
        {task.text}
      </Container>
      <Container gap={2}>
        <FaIcon icon={['fas', 'edit']} size='sm' />
        <FaIcon icon={['fas', 'trash']} size='sm' />
      </Container>
    </TaskItemContainer>
  );
};
