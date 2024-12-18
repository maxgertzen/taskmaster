import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { FC } from 'react';

import { Filters } from '../../types/mutations';
import { Task } from '../../types/shared';
import { ClickableWord } from '../ClickableWord/ClickableWord';
import { Loader } from '../Loader/Loader';
import { TaskItem } from '../TaskItem/TaskItem';
import { Title } from '../Title/Title';

import { StyledTaskListContainer } from './TaskList.styled';

interface TaskListProps {
  tasks: Task[];
  activeFilter?: Filters;
  onDeleteTask: (taskId: string) => Promise<void>;
  onEditTask: (taskId: string) => (updates: Partial<Task>) => Promise<void>;
  onDragEnd: (result: DropResult) => void;
}

export const TaskList: FC<TaskListProps> = ({
  tasks,
  activeFilter,
  onDeleteTask,
  onEditTask,
  onDragEnd,
}) => {
  if (tasks?.length) {
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

  if (!tasks?.length) {
    if (activeFilter) {
      return (
        <Title variant='h6'>
          No tasks found for the selected filter, try{' '}
          <ClickableWord target='clear-filter'>clearing</ClickableWord> it!
        </Title>
      );
    }

    return (
      <Title variant='h6'>
        No tasks found, <ClickableWord target='add-task'>create</ClickableWord>{' '}
        a new task to get started!
      </Title>
    );
  }

  return <Loader paddingTop={3} />;
};
