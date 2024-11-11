import { FC } from 'react';

import { List } from '../../types/shared';
import { ListItem } from '../ListItem/ListItem';
import { ListsActions } from '../ListsActions/ListsActions';

import {
  ListSidebarContainer,
  ListSidebarUnorderedList,
} from './ListSidebar.styled';

interface ListSidebarProps {
  lists: List[];
  selectedList: string | null;
}

// TODO:
// - Implement a way to select a list
// - Implement a way to add a new list
// - Implement a way to remove a list
// - Implement a way to edit a list
// - Implement a way to reorder lists
export const ListSidebar: FC<ListSidebarProps> = ({ lists, selectedList }) => {
  return (
    <>
      <ListSidebarContainer>
        <ListsActions addList={() => console.log('Add list')} />
        <ListSidebarUnorderedList>
          {lists.map(({ id, name }) => (
            <ListItem key={id} name={name} isActive={selectedList === id} />
          ))}
        </ListSidebarUnorderedList>
      </ListSidebarContainer>
    </>
  );
};
