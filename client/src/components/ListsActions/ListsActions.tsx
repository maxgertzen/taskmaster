import { FC } from 'react';

import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

import { ListsActionsContainer } from './ListsActions.styled';

interface ListsActionsProps {
  addList: () => void;
}

export const ListsActions: FC<ListsActionsProps> = ({ addList }) => {
  return (
    <ListsActionsContainer>
      <h6>Lists</h6>
      <FaIcon icon={['fas', 'plus']} onClick={addList} />
    </ListsActionsContainer>
  );
};
