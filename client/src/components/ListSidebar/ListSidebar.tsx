import { FC } from 'react';

import { List } from '../../types/shared';
import { ListItem } from '../ListItem/ListItem';

import { ListSidebarContainer } from './ListSidebar.styled';

interface ListSidebarProps {
  lists: List[];
}

// TODO:
// - Implement a way to select a list
// - Implement a way to add a new list
// - Implement a way to remove a list
// - Implement a way to edit a list
// - Implement a way to reorder lists
export const ListSidebar: FC<ListSidebarProps> = ({ lists }) => {
  return (
    <ListSidebarContainer>
      {lists.map(({ id, name }) => (
        <ListItem key={id} name={name} />
      ))}
    </ListSidebarContainer>
  );
};
