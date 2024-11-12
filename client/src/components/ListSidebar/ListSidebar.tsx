import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { FC, useState } from 'react';

import { useListsMutation } from '../../hooks/useListMutation';
import { List } from '../../types/shared';
import { ListInput } from '../ListInput/ListInput';
import { ListItem } from '../ListItem/ListItem';
import { ListItemContainer } from '../ListItem/ListItem.styled';
import { ListsActions } from '../ListsActions/ListsActions';

import {
  ListSidebarContainer,
  ListSidebarUnorderedList,
} from './ListSidebar.styled';

interface ListSidebarProps {
  lists: List[];
  selectedList: string | null;
  onSelectList: (listId: string) => () => void;
  onDeleteList: () => void;
}

export const ListSidebar: FC<ListSidebarProps> = ({
  lists,
  selectedList,
  onSelectList,
  onDeleteList,
}) => {
  const [isAdding, setIsAdding] = useState(false);

  const addList = useListsMutation('add');
  const editList = useListsMutation('edit');
  const deleteList = useListsMutation('delete');
  const reorderLists = useListsMutation('reorder');

  const handleAddList = async (name: string) => {
    await addList.mutateAsync({ name });
    setIsAdding(false);
  };

  const handleDeleteList = (listId: string) => async () => {
    await deleteList.mutateAsync({ listId });
    if (selectedList === listId) {
      onDeleteList();
    }
  };

  const handleEditList = (listId: string) => async (newName: string) => {
    await editList.mutateAsync({ listId, name: newName });
  };

  const handleOnDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    await reorderLists.mutateAsync({
      reorderingObject: {
        oldIndex: result.source.index,
        newIndex: result.destination.index,
      },
    });
  };

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
                <Draggable key={id} index={index} draggableId={id}>
                  {(provided, snapshot) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.draggableProps.style}
                      dragHandleProps={provided.dragHandleProps}
                      isDragging={snapshot.isDragging}
                      key={id}
                      name={name}
                      isActive={selectedList === id}
                      handleDeleteList={handleDeleteList(id)}
                      handleSelectList={onSelectList(id)}
                      onEdit={handleEditList(id)}
                    />
                  )}
                </Draggable>
              ))}
              {isAdding && (
                <ListItemContainer>
                  <ListInput
                    placeholder='Enter new list name'
                    onSubmit={handleAddList}
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
};
