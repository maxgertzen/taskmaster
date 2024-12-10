import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { FC } from 'react';

import { Task } from '../../types/shared';
import { Loader } from '../Loader/Loader';
import { TaskItem } from '../TaskItem/TaskItem';

import { StyledTaskListContainer } from './TaskList.styled';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => Promise<void>;
  onEditTask: (taskId: string) => (updates: Partial<Task>) => Promise<void>;
  onDragEnd: (result: DropResult) => void;
}

export const TaskList: FC<TaskListProps> = ({
  tasks,
  onDeleteTask,
  onEditTask,
  onDragEnd,
}) => {
  if (tasks) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='task-list'>
          {(provided, snapshot) => (
            <StyledTaskListContainer
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
                      onDeleteTask={async () => {
                        onDeleteTask(task.id);
                      }}
                      onUpdateTask={onEditTask(task.id)}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </StyledTaskListContainer>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  return <Loader paddingTop={3} />;
};
