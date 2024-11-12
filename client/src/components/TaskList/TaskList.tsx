import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { FC } from 'react';

import { useTasksMutation } from '../../hooks/useTaskMutation';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types/shared';
import { TaskItem } from '../TaskItem/TaskItem';

import { TaskListContainer } from './TaskList.styled';

interface TaskListProps {
  selectedListId: string | null;
}

export const TaskList: FC<TaskListProps> = ({ selectedListId }) => {
  const { tasks } = useTasks(selectedListId);

  const editTask = useTasksMutation('edit');
  const deleteTask = useTasksMutation('delete');
  const reorderTasks = useTasksMutation('reorder');

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

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    await reorderTasks.mutateAsync({
      listId: selectedListId,
      reorderingObject: {
        oldIndex: result.source.index,
        newIndex: result.destination.index,
      },
    });
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
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
                    onDeleteTask={handleDeleteTask(task.id)}
                    onCompletedTask={handleCompletedTask(task.id)}
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
