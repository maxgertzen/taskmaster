import { FC, useEffect, useState } from 'react';

import { useDragAndDropHandler } from '../../hooks/useDragAndDropHandler';
import { useListsMutation } from '../../hooks/useListMutation';
import { useLists } from '../../hooks/useLists';
import { useViewportStore } from '../../store/store';
import { ExitButton } from '../ExitButton/ExitButton';
import { HomeButton } from '../HomeButton/HomeButton';
import { ListSidebar } from '../ListSidebar/ListSidebar';
import { ResizableHandle } from '../ResizableHandle/ResizableHandle';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';

import {
  PanelButtonContainer,
  SidebarContainer,
  StyledCollapsibleButton,
} from './Sidebar.styled';

export interface SidebarProps {
  selectedListId: string | null;
  onSelectList: (listId: string | null) => void;
}

export const Sidebar: FC<SidebarProps> = ({ selectedListId, onSelectList }) => {
  const isMobile = useViewportStore((state) => state.isMobile);
  const [isAdding, setIsAdding] = useState(false);
  const { lists } = useLists();
  const { addList, editList, deleteList, reorderList } = useListsMutation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleAddList = async (name: string) => {
    addList.mutate({ name });
    setIsAdding(false);
  };

  const handleDeleteList = async (listId: string) => {
    if (selectedListId === listId) {
      onSelectList(null);
    }
    deleteList.mutate({ listId });
  };

  const handleEditList = async (listId: string, name: string) => {
    editList.mutate({ listId, name });
  };

  const onReorderLists = async (oldIndex: number, newIndex: number) => {
    reorderList.mutate({
      reorderingObject: { oldIndex, newIndex },
    });
  };

  const { handleOnDragEnd } = useDragAndDropHandler({
    onReorder: onReorderLists,
  });

  const handleHomeClick = () => {
    onSelectList(null);
  };

  const handleExitClick = () => {
    // Make Log Out
  };

  useEffect(() => {
    if (isResizing) {
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = 'default';
    }
  }, [isResizing]);

  return (
    <SidebarContainer isCollapsed={isCollapsed} width={sidebarWidth}>
      {!isMobile && (
        <StyledCollapsibleButton onClick={handleToggleSidebar}>
          {isCollapsed ? (
            <SpriteIcon name='openpanel' />
          ) : (
            <>
              <PanelButtonContainer>
                <SpriteIcon name='closepanel' alt='close panel' />
                <p>Close Panel</p>
              </PanelButtonContainer>
            </>
          )}
        </StyledCollapsibleButton>
      )}
      <HomeButton isCollapsed={isCollapsed} onClick={handleHomeClick} />
      {!isCollapsed ? (
        <ListSidebar
          lists={lists}
          selectedListId={selectedListId}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          onSelectList={onSelectList}
          onDeleteList={handleDeleteList}
          onEditList={handleEditList}
          onAddList={handleAddList}
          onDragEnd={handleOnDragEnd}
        />
      ) : (
        <SpriteIcon name='list' onClick={() => setIsCollapsed(false)} />
      )}
      {!isMobile && (
        <ResizableHandle
          initialWidth={sidebarWidth}
          setWidth={setSidebarWidth}
          onResize={(isResizing) => setIsResizing(isResizing)}
        />
      )}
      <ExitButton isCollapsed={isCollapsed} onClick={handleExitClick} />
    </SidebarContainer>
  );
};
