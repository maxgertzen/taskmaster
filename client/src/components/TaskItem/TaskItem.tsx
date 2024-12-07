import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import React, { useState, forwardRef, useEffect } from 'react';

import { Task } from '../../types/shared';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';
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
            <FaIcon icon={['fas', 'grip-vertical']} size='sm' />
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
          <FaIcon
            icon={['fas', 'edit']}
            size='sm'
            onClick={onEditClick}
            isActive={isEditing}
          />
          <FaIcon
            icon={['fas', 'trash']}
            size='sm'
            onClick={handleDeleteTask}
          />
        </StyledItemContainer>
      </StyledTaskItemContainer>
    );
  }
);

TaskItem.displayName = 'TaskItem';
