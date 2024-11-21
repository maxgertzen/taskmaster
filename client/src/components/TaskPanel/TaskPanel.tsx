import { FC, useMemo, useState } from 'react';

import { useDragAndDropHandler } from '../../hooks/useDragAndDropHandler';
import { useLists } from '../../hooks/useLists';
import { useTasksMutation } from '../../hooks/useTaskMutation';
import { useTasks } from '../../hooks/useTasks';
import { Filters, Sort } from '../../types/mutations';
import { Task } from '../../types/shared';
import { TaskActions } from '../TaskActions/TaskActions';
import { TaskList } from '../TaskList/TaskList';
import { Title } from '../Title/Title';

import { TaskContainer } from './TaskPanel.styled';

interface TaskPanelProps {
  listId: string | null;
}

export const TaskPanel: FC<TaskPanelProps> = ({ listId }) => {
  const [filter, setFilter] = useState<Filters>(null);
  const [sort, setSort] = useState<Sort>(null);
  const { tasks } = useTasks({ listId, filter, sort });
  const { lists } = useLists();

  const isAllCompleted = useMemo(
    () => tasks?.every((task) => task.completed) ?? false,
    [tasks]
  );

  const {
    addTask,
    editTask,
    deleteTask,
    reorderTask,
    toggleComplete,
    deleteAll,
  } = useTasksMutation();

  const handleDeleteTask = async (taskId: string) => {
    deleteTask.mutate({ taskId, listId });
  };

  const handleEditTask = (taskId: string) => async (updates: Partial<Task>) => {
    editTask.mutate({
      taskId,
      listId,
      ...updates,
    });
  };

  const handleAddTask = async (text: string) => {
    addTask.mutate({ listId, text });
  };

  const onReorderTasks = async (oldIndex: number, newIndex: number) => {
    return reorderTask.mutate({
      listId,
      reorderingObject: { oldIndex, newIndex },
    });
  };

  const { handleOnDragEnd } = useDragAndDropHandler({
    onReorder: onReorderTasks,
  });

  const handleCompleteAll = async () => {
    toggleComplete.mutate({ listId, completed: !isAllCompleted });
  };

  const handleDeleteAll = async () => {
    deleteAll.mutate({ listId });
  };

  const listName = useMemo(
    () => lists?.find((list) => list.id === listId)?.name || '',
    [lists, listId]
  );

  return (
    <TaskContainer>
      {listId ? (
        <>
          {listName && <Title variant='h3'>{listName}</Title>}
          <TaskActions
            isAllCompleted={isAllCompleted}
            onAdd={handleAddTask}
            onDeleteAll={handleDeleteAll}
            onToggleCompleteAll={handleCompleteAll}
          />
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
