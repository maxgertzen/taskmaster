import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { FC } from 'react';

import { Task } from '../../types/shared';
import { TaskItem } from '../TaskItem/TaskItem';

import { TaskListContainer } from './TaskList.styled';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDragEnd: (result: DropResult) => void;
}

export const TaskList: FC<TaskListProps> = ({
  tasks,
  isLoading,
  onDeleteTask,
  onEditTask,
  onDragEnd,
}) => {
  if (isLoading) return <div>Loading tasks...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='task-list'>
        {(provided, snapshot) => (
          <TaskListContainer
            ref={provided.innerRef}
            {...provided.droppableProps}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {tasks?.map((task, index) => (
              <Draggable key={task.id} index={index} draggableId={task.id}>
                {(provided, snapshot) => (
                  <TaskItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.draggableProps.style}
                    dragHandleProps={provided.dragHandleProps}
                    isDragging={snapshot.isDragging}
                    task={task}
                    onDeleteTask={() => onDeleteTask(task.id)}
                    onCompletedTask={(updates) => onEditTask(task.id, updates)}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </TaskListContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};
