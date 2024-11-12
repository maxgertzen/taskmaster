import { FC } from 'react';

import { useTasksMutation } from '../../hooks/useTaskMutation';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types/shared';
import { TaskItem } from '../TaskItem/TaskItem';

import { TaskListContainer } from './TaskList.styled';

interface TaskListProps {
  selectedListId: string | null;
}

// TODO:
// - Implement a way to reorder tasks
export const TaskList: FC<TaskListProps> = ({ selectedListId }) => {
  const { tasks } = useTasks(selectedListId);

  const editTask = useTasksMutation('edit');
  const deleteTask = useTasksMutation('delete');

  const handleDeleteTask = (taskId: string) => async () => {
    await deleteTask.mutateAsync({ taskId, listId: selectedListId });
  };

  const handleCompletedTask =
    (taskId: string) => async (updates: Partial<Task>) => {
      await editTask.mutateAsync({
        taskId,
        listId: selectedListId,
        ...updates,
      });
    };

  return (
    <TaskListContainer>
      {tasks?.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDeleteTask={handleDeleteTask(task.id)}
          onCompletedTask={handleCompletedTask(task.id)}
        />
      ))}
    </TaskListContainer>
  );
};
