import { FC } from 'react';

import { ListItemContainer } from './ListItem.styled';

interface ListItemProps {
  name: string;
}

// TODO:
// - Implement remove button that will remove the list
// - Implement edit button that will allow the user to edit the list name
// - Implement a button to select the list
// - Implement a button to reorder lists
export const ListItem: FC<ListItemProps> = ({ name }) => {
  return <ListItemContainer>{name}</ListItemContainer>;
};
