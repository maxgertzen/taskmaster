import { FC, useMemo, useState } from 'react';

import { Filters, Sort } from '@/shared/types/mutations';
import { List, Task } from '@/shared/types/shared';

import { TaskBoard } from '../components';
import { useTasksMutation } from '../hooks/useTaskMutation';
import { useTasks } from '../hooks/useTasks';

interface TaskManagerProps {
  list: List | null;
}

export const TaskManager: FC<TaskManagerProps> = ({ list }) => {
  const [filter, setFilter] = useState<Filters>(null);
  const [sort, setSort] = useState<Sort>(null);
  const { tasks } = useTasks({ listId: list?.id, filter, sort });

  const [isAllCompleted, isAnyCompleted] = useMemo(() => {
    const isAllCompleted = tasks?.every((task) => task.completed) ?? false;
    const isAnyCompleted = tasks?.some((task) => task.completed) ?? false;
    return [isAllCompleted, isAnyCompleted];
  }, [tasks]);

  const {
    addTask,
    editTask,
    deleteTask,
    reorderTask,
    toggleComplete,
    bulkDelete,
  } = useTasksMutation();

  const handleDeleteTask = async (id: string) => {
    await deleteTask.mutateAsync({ id, listId: list?.id });
  };

  const handleEditTask = (id: string) => async (updates: Partial<Task>) => {
    await editTask.mutateAsync({
      id,
      listId: list?.id,
      ...updates,
    });
  };

  const handleAddTask = async (text: string) => {
    await addTask.mutateAsync({ listId: list?.id, text });
  };

  const handleReorderTasks = async (oldIndex: number, newIndex: number) => {
    await reorderTask.mutateAsync({
      listId: list?.id,
      reorderingObject: { oldIndex, newIndex },
    });
  };

  const handleCompleteAll = async () => {
    await toggleComplete.mutateAsync({
      listId: list?.id,
      completed: !isAllCompleted,
    });
  };

  const handleBulkDelete = (mode?: 'completed') => async () => {
    if (mode === 'completed' && !tasks?.some((task) => task.completed)) return;
    await bulkDelete.mutateAsync({ listId: list?.id, deleteMode: mode });
  };

  const handleFilter = (newFilter: Filters) => {
    if (filter === newFilter) return setFilter(null);
    setFilter(newFilter);
  };

  const handleSort = (newSort: Sort) => {
    if (sort === newSort) return setSort(null);
    setSort(newSort);
  };

  return (
    <TaskBoard
      tasks={tasks}
      listName={list?.name || ''}
      filter={filter}
      sort={sort}
      isAllCompleted={isAllCompleted}
      isAnyCompleted={isAnyCompleted}
      onFilter={handleFilter}
      onSort={handleSort}
      onBulkDelete={handleBulkDelete}
      onCompleteAll={handleCompleteAll}
      onAddTask={handleAddTask}
      onEditTask={handleEditTask}
      onDeleteTask={handleDeleteTask}
      onReorderTasks={handleReorderTasks}
    />
  );
};
