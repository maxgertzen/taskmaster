import { FC } from 'react';

import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

import { ListItemContainer } from './ListItem.styled';

interface ListItemProps {
  name: string;
  isActive?: boolean;
}

// TODO:
// - Implement remove button that will remove the list
// - Implement edit button that will allow the user to edit the list name
// - Implement a button to select the list
// - Implement a button to reorder lists
export const ListItem: FC<ListItemProps> = ({ name, isActive = false }) => {
  return (
    <ListItemContainer isActive={isActive}>
      {name}
      <FaIcon icon={['fas', 'trash']} size='xs' />
    </ListItemContainer>
  );
};
