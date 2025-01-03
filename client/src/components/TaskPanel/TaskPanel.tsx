import { FC, useMemo, useState } from 'react';

import { useDragAndDropHandler } from '../../hooks/useDragAndDropHandler';
import { useLists } from '../../hooks/useLists';
import { useTasksMutation } from '../../hooks/useTaskMutation';
import { useTasks } from '../../hooks/useTasks';
import { useViewportStore } from '../../store/store';
import { Filters, Sort } from '../../types/mutations';
import { Task } from '../../types/shared';
import { TaskActions } from '../TaskActions/TaskActions';
import { TaskInput } from '../TaskInput/TaskInput';
import { TaskList } from '../TaskList/TaskList';
import { TaskListViews } from '../TaskListViews/TaskListViews';
import { TaskSearchResults } from '../TaskSearchResults/TaskSearchResults';
import { Title } from '../Title/Title';

import { TaskContainer, TaskHeaderContainer } from './TaskPanel.styled';

interface TaskPanelProps {
  listId: string | null;
}

export const TaskPanel: FC<TaskPanelProps> = ({ listId }) => {
  const isMobile = useViewportStore((state) => state.isMobile);
  const [filter, setFilter] = useState<Filters>(null);
  const [sort, setSort] = useState<Sort>(null);
  const { tasks } = useTasks({ listId, filter, sort });
  const { lists } = useLists();

  const isAllCompleted = useMemo(
    () => tasks?.every((task) => task.completed) ?? false,
    [tasks]
  );

  const isAnyCompleted = useMemo(
    () => tasks?.some((task) => task.completed) ?? false,
    [tasks]
  );

  const {
    addTask,
    editTask,
    deleteTask,
    reorderTask,
    toggleComplete,
    bulkDelete,
  } = useTasksMutation();

  const handleDeleteTask = async (id: string) => {
    await deleteTask.mutateAsync({ id, listId });
  };

  const handleEditTask = (id: string) => async (updates: Partial<Task>) => {
    await editTask.mutateAsync({
      id,
      listId,
      ...updates,
    });
  };

  const handleAddTask = async (text: string) => {
    await addTask.mutateAsync({ listId, text });
  };

  const onReorderTasks = async (oldIndex: number, newIndex: number) => {
    await reorderTask.mutateAsync({
      listId,
      reorderingObject: { oldIndex, newIndex },
    });
  };

  const { handleOnDragEnd } = useDragAndDropHandler({
    onReorder: onReorderTasks,
  });

  const handleCompleteAll = async () => {
    await toggleComplete.mutateAsync({ listId, completed: !isAllCompleted });
  };

  const handleBulkDelete = (mode?: 'completed') => async () => {
    if (mode === 'completed' && !tasks?.some((task) => task.completed)) return;
    await bulkDelete.mutateAsync({ listId, deleteMode: mode });
  };

  const handleFilter = (newFilter: Filters) => {
    if (filter === newFilter) return setFilter(null);
    setFilter(newFilter);
  };

  const handleSort = (newSort: Sort) => {
    if (sort === newSort) return setSort(null);
    setSort(newSort);
  };

  const listName = useMemo(
    () => lists?.find((list) => list.id === listId)?.name || '',
    [lists, listId]
  );

  return (
    <TaskContainer>
      {listId ? (
        <>
          <TaskHeaderContainer>
            {listName && <Title variant='h3'>{listName}</Title>}
            <TaskActions
              isAllCompleted={isAllCompleted}
              isAnyCompleted={isAnyCompleted}
              onAdd={handleAddTask}
              onDeleteAll={handleBulkDelete}
              onToggleCompleteAll={handleCompleteAll}
            />
          </TaskHeaderContainer>
          <TaskListViews
            filter={filter}
            sort={sort}
            onFilter={handleFilter}
            onSort={handleSort}
          />
          <TaskList
            tasks={tasks}
            activeFilter={filter}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDragEnd={handleOnDragEnd}
          />
          {isMobile && (
            <TaskInput
              highlightId='add-task'
              onSubmit={handleAddTask}
              withToggle
            />
          )}
        </>
      ) : (
        <TaskSearchResults />
      )}
    </TaskContainer>
  );
};
