import { FC, useState } from 'react';

import { List } from '@/shared/types/shared';

import { ListSidebar } from '../components';
import { useListsMutation } from '../hooks/useListMutation';

interface ListManagerProps {
  lists: List[];
  selectedList: List | null;
  onSelectList: (list: List | null) => void;
}

export const ListManager: FC<ListManagerProps> = ({
  lists,
  selectedList,
  onSelectList,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const { addList, editList, deleteList, reorderList } = useListsMutation();

  const handleAddList = async (name: string) => addList.mutateAsync({ name });
  const handleEditList = async (listId: string, name: string) =>
    editList.mutateAsync({ listId, name });
  const handleDeleteList = async (listId: string) =>
    deleteList.mutateAsync({ listId });
  const handleReorderList = async (oldIndex: number, newIndex: number) =>
    reorderList.mutateAsync({ newIndex, oldIndex });

  return (
    <ListSidebar
      lists={lists}
      isAdding={isAdding}
      setIsAdding={setIsAdding}
      selectedList={selectedList}
      onAddList={handleAddList}
      onEditList={handleEditList}
      onDeleteList={handleDeleteList}
      onSelectList={onSelectList}
      onReorderList={handleReorderList}
    />
  );
};
