import { FC, useState } from 'react';

import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';
import { ListInput } from '../ListInput/ListInput';

import { ActionsContainer, ListItemContainer } from './ListItem.styled';

interface ListItemProps {
  name: string;
  isEditing?: boolean;
  handleSelectList: () => void;
  handleDeleteList: () => void;
  onEdit: (newName: string) => void;
  isActive?: boolean;
}

// TODO:
// - Implement a button to reorder lists
export const ListItem: FC<ListItemProps> = ({
  name,
  handleSelectList,
  handleDeleteList,
  onEdit,
  isActive = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditSubmit = (newName: string) => {
    onEdit(newName);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleActionClick =
    (action: 'edit' | 'delete') => (event: React.MouseEvent) => {
      event.stopPropagation();

      if (action === 'edit') {
        setIsEditing(true);
      } else {
        handleDeleteList();
      }
    };

  return (
    <ListItemContainer isActive={isActive} onClick={handleSelectList}>
      {isEditing ? (
        <ListInput
          initialName={name}
          placeholder='Update list name'
          onSubmit={handleEditSubmit}
          onCancel={handleCancelEdit}
        />
      ) : (
        <>
          {name}
          <ActionsContainer>
            <FaIcon
              icon={['fas', 'edit']}
              size='xs'
              onClick={handleActionClick('edit')}
            />
            <FaIcon
              icon={['fas', 'trash']}
              size='xs'
              onClick={handleActionClick('delete')}
            />
          </ActionsContainer>
        </>
      )}
    </ListItemContainer>
  );
};
