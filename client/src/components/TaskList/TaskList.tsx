import { FC } from 'react';

import { useTasks } from '../../hooks/useTasks';
import { TaskItem } from '../TaskItem/TaskItem';

import { TaskListContainer } from './TaskList.styled';

interface TaskListProps {
  selectedListId: string | null;
}

// TODO:
// - Implement a way to mark a task as complete
// - Implement a way to edit a task
// - Implement a way to remove a task
// - Implement a way to reorder tasks
export const TaskList: FC<TaskListProps> = ({ selectedListId }) => {
  const { tasks } = useTasks(selectedListId);

  return (
    <TaskListContainer>
      {tasks?.map((task) => <TaskItem key={task.id} task={task} />)}
    </TaskListContainer>
  );
};
