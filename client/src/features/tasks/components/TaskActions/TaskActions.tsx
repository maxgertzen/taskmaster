import { FC, useRef } from 'react';

import { PopupMenu, SpriteIcon, Input } from '@/features/ui/components';
import { usePopupMenuState } from '@/shared/hooks';
import { useViewportStore } from '@/shared/store/viewportStore';

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
  const isMobile = useViewportStore((state) => state.isMobile);

  return (
    <TaskActionsContainer>
      {!isMobile && (
        <Input placeholder='Add Task' highlightId='add-task' onSubmit={onAdd} />
      )}
      <IconContainer
        ref={triggerRef}
        aria-haspopup='true'
        aria-expanded={isOpen}
        role='button'
        onClick={toggleMenu}
      >
        <SpriteIcon name='three-dots' alt='bulk actions' />
        <PopupMenu
          orientation='right'
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
