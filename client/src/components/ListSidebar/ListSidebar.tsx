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

// TODO:
// - Implement a way to reorder lists
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

  return (
    <>
      <ListSidebarContainer>
        <ListsActions addList={() => setIsAdding(true)} />
        <ListSidebarUnorderedList>
          {lists.map(({ id, name }) => (
            <ListItem
              key={id}
              name={name}
              isActive={selectedList === id}
              handleDeleteList={handleDeleteList(id)}
              handleSelectList={onSelectList(id)}
              onEdit={handleEditList(id)}
            />
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
        </ListSidebarUnorderedList>
      </ListSidebarContainer>
    </>
  );
};
