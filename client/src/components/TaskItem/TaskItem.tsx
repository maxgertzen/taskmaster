import React from 'react';

import { Task } from '../../types/shared';

import { TaskItemContainer } from './TaskItem.styled';

interface TaskProps {
  task: Task;
}

// TODO:
// - Implement remove button that will remove the task
// - Implement edit button that will allow the user to edit the task text
// - Implement a button to mark the task as done
// - Implement a button to reorder tasks
export const TaskItem: React.FC<TaskProps> = ({ task }) => {
  return <TaskItemContainer>{task.text}</TaskItemContainer>;
};
