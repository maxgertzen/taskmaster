import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { FC } from 'react';

import { List } from '../../types/shared';
import { ListInput } from '../ListInput/ListInput';
import { ListItem } from '../ListItem/ListItem';
import { ListItemContainer } from '../ListItem/ListItem.styled';
import { ListsActions } from '../ListsActions/ListsActions';
import { Loader } from '../Loader/Loader';

import {
  ListSidebarContainer,
  ListSidebarUnorderedList,
} from './ListSidebar.styled';

interface ListSidebarProps {
  lists: List[];
  isAdding: boolean;
  selectedListId: string | null;
  setIsAdding: (isAdding: boolean) => void;
  onAddList: (name: string) => void;
  onDeleteList: (listId: string) => void;
  onEditList: (listId: string, name: string) => void;
  onDragEnd: (result: DropResult) => void;
  onSelectList: (listId: string) => void;
}

export const ListSidebar: FC<ListSidebarProps> = ({
  lists,
  isAdding,
  selectedListId,
  setIsAdding,
  onAddList,
  onDeleteList,
  onEditList,
  onDragEnd,
  onSelectList,
}) => {
  if (lists) {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
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
                        id={id}
                        name={name}
                        isActive={selectedListId === id}
                        handleDeleteList={() => onDeleteList(id)}
                        handleSelectList={() => onSelectList(id)}
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
