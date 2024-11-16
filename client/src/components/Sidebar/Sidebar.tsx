import { FC, useEffect, useState } from 'react';

import { useDragAndDropHandler } from '../../hooks/useDragAndDropHandler';
import { useListsMutation } from '../../hooks/useListMutation';
import { useLists } from '../../hooks/useLists';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';
import { ListSidebar } from '../ListSidebar/ListSidebar';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import { ResizableHandle } from '../ResizableHandle/ResizableHandle';

import { SidebarContainer, StyledCollapsibleButton } from './Sidebar.styled';

export interface SidebarProps {
  selectedListId: string | null;
  onSelectList: (listId: string | null) => void;
}

export const Sidebar: FC<SidebarProps> = ({ selectedListId, onSelectList }) => {
  const [isAdding, setIsAdding] = useState(false);
  const { lists, isLoading } = useLists();
  const { addList, editList, deleteList, reorderList } = useListsMutation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleAddList = async (name: string) => {
    await addList.mutateAsync({ name });
    setIsAdding(false);
  };

  const handleDeleteList = async (listId: string) => {
    await deleteList.mutateAsync({ listId });
    if (selectedListId === listId) {
      onSelectList(null);
    }
  };

  const handleEditList = async (listId: string, name: string) => {
    await editList.mutateAsync({ listId, name });
  };

  const onReorderLists = async (oldIndex: number, newIndex: number) => {
    await reorderList.mutateAsync({
      reorderingObject: { oldIndex, newIndex },
    });
  };

  const { handleOnDragEnd } = useDragAndDropHandler({
    onReorder: onReorderLists,
  });

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isResizing]);

  return (
    <SidebarContainer isCollapsed={isCollapsed} width={sidebarWidth}>
      <StyledCollapsibleButton
        isCollapsed={isCollapsed}
        onClick={handleToggleSidebar}
      >
        <FaIcon icon={['far', 'square-caret-left']} size='lg' />
      </StyledCollapsibleButton>

      {!isCollapsed && (
        <ListSidebar
          lists={lists}
          selectedListId={selectedListId}
          isAdding={isAdding}
          isLoading={isLoading}
          setIsAdding={setIsAdding}
          onSelectList={onSelectList}
          onDeleteList={handleDeleteList}
          onEditList={handleEditList}
          onAddList={handleAddList}
          onDragEnd={handleOnDragEnd}
        />
      )}
      {!isCollapsed && <LogoutButton />}
      <ResizableHandle
        initialWidth={sidebarWidth}
        setWidth={setSidebarWidth}
        onResize={(isResizing) => setIsResizing(isResizing)}
      />
    </SidebarContainer>
  );
};
