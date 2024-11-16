import { FC } from 'react';

import { useDragAndDropHandler } from '../../hooks/useDragAndDropHandler';
import { useTasksMutation } from '../../hooks/useTaskMutation';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types/shared';
import { AddTaskInput } from '../AddTaskInput/AddTaskInput';
import { TaskList } from '../TaskList/TaskList';

import { TaskContainer } from './TaskPanel.styled';

interface TaskPanelProps {
  selectedListId: string | null;
}

export const TaskPanel: FC<TaskPanelProps> = ({ selectedListId }) => {
  const { tasks, isLoading } = useTasks(selectedListId);

  const { addTask, editTask, deleteTask, reorderTask } = useTasksMutation();

  const handleDeleteTask = (taskId: string) => async () => {
    await deleteTask.mutateAsync({ taskId, listId: selectedListId });
  };

  const handleEditTask = (taskId: string) => async (updates: Partial<Task>) => {
    await editTask.mutateAsync({
      taskId,
      listId: selectedListId,
      ...updates,
    });
  };

  const handleAddTask = async (text: string) => {
    await addTask.mutateAsync({ listId: selectedListId, text });
  };

  const onReorderTasks = async (oldIndex: number, newIndex: number) => {
    await reorderTask.mutateAsync({
      listId: selectedListId,
      reorderingObject: { oldIndex, newIndex },
    });
  };

  const { handleOnDragEnd } = useDragAndDropHandler({
    onReorder: onReorderTasks,
  });

  return (
    <TaskContainer>
      {selectedListId ? (
        <>
          <AddTaskInput onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDragEnd={handleOnDragEnd}
          />
        </>
      ) : (
        <h4>Select a list to view tasks</h4>
      )}
    </TaskContainer>
  );
};
