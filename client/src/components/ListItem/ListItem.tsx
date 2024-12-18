import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { forwardRef, useState } from 'react';

import { useTasks } from '../../hooks/useTasks';
import { ListInput } from '../ListInput/ListInput';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';

import {
  ActionsContainer,
  Container,
  DragIconWrapper,
  ListItemContainer,
} from './ListItem.styled';

interface ListItemProps {
  id: string;
  name: string;
  isEditing?: boolean;
  dragHandleProps: DraggableProvidedDragHandleProps | null;
  isDragging?: boolean;
  handleSelectList: () => void;
  handleDeleteList: () => void;
  onEdit: (newName: string) => void;
  isActive?: boolean;
}

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(
  (
    {
      id,
      name,
      handleSelectList,
      handleDeleteList,
      onEdit,
      dragHandleProps,
      isActive = false,
      ...rest
    },
    ref
  ) => {
    const [isEditing, setIsEditing] = useState(false);
    const { prefetchTasks } = useTasks({ listId: null });

    const handleEditSubmit = (newName: string) => {
      onEdit(newName);
      setIsEditing(false);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
    };

    const handleActionClick =
      (action: 'edit' | 'delete') =>
      (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        event.stopPropagation();
        if (action === 'edit') {
          setIsEditing(true);
        } else {
          handleDeleteList();
        }
      };

    return (
      <ListItemContainer
        ref={ref}
        {...rest}
        isActive={isActive}
        onClick={handleSelectList}
        onMouseEnter={() => prefetchTasks(id)}
      >
        {isEditing ? (
          <ListInput
            initialName={name}
            placeholder='Update list name'
            onSubmit={handleEditSubmit}
            onCancel={handleCancelEdit}
          />
        ) : (
          <>
            <Container>
              <DragIconWrapper {...dragHandleProps}>
                <SpriteIcon name='drag' />
              </DragIconWrapper>
              {name}
            </Container>
            <ActionsContainer>
              <SpriteIcon name='pencil' onClick={handleActionClick('edit')} />
              <SpriteIcon name='trash' onClick={handleActionClick('delete')} />
            </ActionsContainer>
          </>
        )}
      </ListItemContainer>
    );
  }
);
