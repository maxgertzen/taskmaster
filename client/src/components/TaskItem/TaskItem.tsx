import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import React, { useState, forwardRef, useEffect } from 'react';

import { Task } from '../../types/shared';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';
import { TaskEditInput } from '../TaskEditInput/TaskEditInput';

import { Checkbox } from './Checkbox/Checkbox';
import {
  DragIconWrapper,
  StyledItemContainer,
  StyledTaskItemContainer,
} from './TaskItem.styled';

interface TaskProps {
  task: Task;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
  onDeleteTask: () => void;
  onUpdateTask: (updates: Partial<Task>) => Promise<void>;
}

export const TaskItem = forwardRef<HTMLLIElement, TaskProps>(
  (
    { task, onDeleteTask, onUpdateTask, isDragging, dragHandleProps, ...rest },
    ref
  ) => {
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(task.completed);
    const [isEditing, setIsEditing] = useState(false);

    const handleToggleComplete = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsCheckboxChecked(e.target.checked);
      onUpdateTask({ completed: e.target.checked });
    };

    const handleEditSubmit = async (newText: string) => {
      setIsEditing(false);
      if (newText === task.text) return;
      await onUpdateTask({ text: newText });
    };

    const onEditClick = () => {
      setIsEditing(true);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    const handleDeleteTask = async () => {
      onDeleteTask();
    };

    useEffect(() => {
      setIsCheckboxChecked(task.completed);
    }, [task.completed]);

    return (
      <StyledTaskItemContainer ref={ref} {...rest} isDragging={isDragging}>
        <StyledItemContainer isCompleted={isCheckboxChecked}>
          <DragIconWrapper {...dragHandleProps}>
            <SpriteIcon name='drag' />
          </DragIconWrapper>
          <Checkbox
            checked={isCheckboxChecked}
            onChange={handleToggleComplete}
          />
          {isEditing ? (
            <TaskEditInput
              initialText={task.text}
              placeholder='Edit task'
              onSubmit={handleEditSubmit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <span>{task.text}</span>
          )}
        </StyledItemContainer>
        <StyledItemContainer gap={2}>
          {!isEditing && <SpriteIcon name='pencil' onClick={onEditClick} />}
          <SpriteIcon name='trash' onClick={handleDeleteTask} />
        </StyledItemContainer>
      </StyledTaskItemContainer>
    );
  }
);

TaskItem.displayName = 'TaskItem';
