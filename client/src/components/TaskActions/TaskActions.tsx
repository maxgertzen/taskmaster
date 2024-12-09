import { FC, useRef } from 'react';

import { usePopupMenuState } from '../../hooks/usePopupMenuState';
import { PopupMenu } from '../PopupMenu/PopupMenu';
import { TaskInput } from '../TaskInput/TaskInput';

import { IconContainer, TaskActionsContainer } from './TaskActions.styled';

interface TaskActionsProps {
  isAllCompleted: boolean;
  isAnyCompleted: boolean;
  onAdd: (text: string) => void;
  onToggleCompleteAll: () => void;
  onDeleteAll: (mode?: 'completed') => () => void;
}

export const TaskActions: FC<TaskActionsProps> = ({
  isAllCompleted,
  isAnyCompleted,
  onAdd,
  onToggleCompleteAll,
  onDeleteAll,
}) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { closeMenu, isOpen, toggleMenu } = usePopupMenuState();
  return (
    <TaskActionsContainer>
      <TaskInput onSubmit={onAdd} />
      <IconContainer
        ref={triggerRef}
        aria-haspopup='true'
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        <p>Bulk Actions</p>
        <PopupMenu
          options={[
            { label: 'Delete All', onClick: onDeleteAll() },
            {
              label: 'Delete Completed',
              onClick: onDeleteAll('completed'),
              disabled: !isAnyCompleted,
            },
            {
              label: `${isAllCompleted ? 'Uncheck' : 'Check'} All`,
              onClick: onToggleCompleteAll,
            },
          ]}
          onClose={closeMenu}
          isOpen={isOpen}
          triggerRef={triggerRef}
        />
      </IconContainer>
    </TaskActionsContainer>
  );
};
