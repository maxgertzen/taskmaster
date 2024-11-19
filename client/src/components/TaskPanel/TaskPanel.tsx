import { FC, useMemo } from 'react';

import { useDragAndDropHandler } from '../../hooks/useDragAndDropHandler';
import { useLists } from '../../hooks/useLists';
import { useTasksMutation } from '../../hooks/useTaskMutation';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types/shared';
import { AddTaskInput } from '../AddTaskInput/AddTaskInput';
import { TaskList } from '../TaskList/TaskList';
import { Title } from '../Title/Title';

import { TaskContainer } from './TaskPanel.styled';

interface TaskPanelProps {
  selectedListId: string | null;
}

export const TaskPanel: FC<TaskPanelProps> = ({ selectedListId }) => {
  const { tasks } = useTasks(selectedListId);
  const { lists } = useLists();

  const { addTask, editTask, deleteTask, reorderTask } = useTasksMutation();

  const handleDeleteTask = async (taskId: string) => {
    deleteTask.mutate({ taskId, listId: selectedListId });
  };

  const handleEditTask = (taskId: string) => async (updates: Partial<Task>) => {
    editTask.mutate({
      taskId,
      listId: selectedListId,
      ...updates,
    });
  };

  const handleAddTask = async (text: string) => {
    addTask.mutate({ listId: selectedListId, text });
  };

  const onReorderTasks = async (oldIndex: number, newIndex: number) => {
    return reorderTask.mutate({
      listId: selectedListId,
      reorderingObject: { oldIndex, newIndex },
    });
  };

  const { handleOnDragEnd } = useDragAndDropHandler({
    onReorder: onReorderTasks,
  });

  const listName = useMemo(
    () => lists?.find((list) => list.id === selectedListId)?.name || '',
    [lists, selectedListId]
  );

  return (
    <TaskContainer>
      {selectedListId ? (
        <>
          {listName && <Title variant='h3'>{listName}</Title>}
          <AddTaskInput onAddTask={handleAddTask} />
          <TaskList
            tasks={tasks}
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
