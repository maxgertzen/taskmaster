import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FC } from 'react';

import { Loader } from '@/features/ui/components';
import { useDragAndDropHandler } from '@/shared/hooks';
import { List } from '@/shared/types/shared';

import { ListInput, ListItem, ListsActions } from '..';
import { ListItemContainer } from '../ListItem/ListItem.styled';

import {
  ListSidebarContainer,
  ListSidebarUnorderedList,
} from './ListSidebar.styled';

interface ListSidebarProps {
  lists: List[];
  isAdding: boolean;
  selectedList: List | null;
  setIsAdding: (isAdding: boolean) => void;
  onAddList: (name: string) => void;
  onDeleteList: (listId: string) => void;
  onEditList: (listId: string, name: string) => void;
  onReorderList: (oldIndex: number, newIndex: number) => void;
  onSelectList: (list: List) => void;
}

export const ListSidebar: FC<ListSidebarProps> = ({
  lists,
  isAdding,
  selectedList,
  setIsAdding,
  onAddList,
  onDeleteList,
  onEditList,
  onReorderList,
  onSelectList,
}) => {
  const { handleOnDragEnd } = useDragAndDropHandler({
    onReorder: onReorderList,
  });

  if (lists) {
    return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <ListSidebarContainer>
          <ListsActions addList={() => setIsAdding(true)} />
          <Droppable droppableId='list-sidebar'>
            {(provided, snapshot) => (
              <ListSidebarUnorderedList
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {lists.map(({ id, name }, index) => (
                  <Draggable
                    key={`${id}-${name}-${index}`}
                    index={index}
                    draggableId={id}
                  >
                    {(provided, snapshot) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.draggableProps.style}
                        dragHandleProps={provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        key={id}
                        name={name}
                        isActive={selectedList?.id === id}
                        handleDeleteList={() => onDeleteList(id)}
                        handleSelectList={() => onSelectList({ id, name })}
                        onEdit={(text) => onEditList(id, text)}
                      />
                    )}
                  </Draggable>
                ))}
                {isAdding && (
                  <ListItemContainer>
                    <ListInput
                      placeholder='Enter new list name'
                      onSubmit={onAddList}
                      onCancel={() => setIsAdding(false)}
                    />
                  </ListItemContainer>
                )}
                {provided.placeholder}
              </ListSidebarUnorderedList>
            )}
          </Droppable>
        </ListSidebarContainer>
      </DragDropContext>
    );
  }

  return <Loader paddingTop={3} />;
};
