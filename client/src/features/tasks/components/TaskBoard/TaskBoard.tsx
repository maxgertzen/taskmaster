import { FC } from 'react';

import { Input, Title } from '@/features/ui/components';
import { useViewportStore } from '@/shared/store/viewportStore';
import { Filters, Sort } from '@/shared/types/mutations';
import { Task } from '@/shared/types/shared';

import { TaskActions, TaskList, TaskListViews } from '..';

import { TaskHeaderContainer } from './TaskBoard.styled';

interface TaskBoardProps {
  tasks: Task[];
  listName: string;
  filter: Filters;
  sort: Sort;
  isAllCompleted: boolean;
  isAnyCompleted: boolean;
  onFilter: (filter: Filters) => void;
  onSort: (sort: Sort) => void;
  onAddTask: (text: string) => void;
  onEditTask: (id: string) => (updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onBulkDelete: (mode?: 'completed') => () => void;
  onCompleteAll: () => void;
  onReorderTasks: (oldIndex: number, newIndex: number) => void;
}

export const TaskBoard: FC<TaskBoardProps> = ({
  tasks,
  listName,
  filter,
  sort,
  isAllCompleted,
  isAnyCompleted,
  onFilter,
  onSort,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onBulkDelete,
  onCompleteAll,
  onReorderTasks,
}) => {
  const isMobile = useViewportStore((state) => state.isMobile);

  return (
    <>
      <TaskHeaderContainer>
        {listName && <Title variant='h3'>{listName}</Title>}
        <TaskActions
          isAllCompleted={isAllCompleted}
          isAnyCompleted={isAnyCompleted}
          onAdd={onAddTask}
          onDeleteAll={onBulkDelete}
          onToggleCompleteAll={onCompleteAll}
        />
      </TaskHeaderContainer>
      <TaskListViews
        filter={filter}
        sort={sort}
        onFilter={onFilter}
        onSort={onSort}
      />
      <TaskList
        tasks={tasks}
        activeFilter={filter}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onReorderTasks={onReorderTasks}
      />
      {isMobile && (
        <Input
          placeholder='Add Task'
          highlightId='add-task'
          onSubmit={onAddTask}
          withToggle
        />
      )}
    </>
  );
};
