import { useAuth0 } from '@auth0/auth0-react';
import { FC, useEffect, useState } from 'react';

import {
  HomeButton,
  ExitButton,
  ResizableHandle,
  SpriteIcon,
} from '@/features/ui/components';
import { useViewportStore } from '@/shared/store/viewportStore';
import { List } from '@/shared/types/shared';

import { ListManager } from '../../managers';

import {
  PanelButtonContainer,
  SidebarContainer,
  StyledCollapsibleButton,
} from './Sidebar.styled';

export interface SidebarLayoutProps {
  lists: List[];
  selectedList: List | null;
  onSelectList: (list: List | null) => void;
}

export const SidebarLayout: FC<SidebarLayoutProps> = ({
  lists,
  selectedList,
  onSelectList,
}) => {
  const { logout } = useAuth0();
  const isMobile = useViewportStore((state) => state.isMobile);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleHomeClick = () => {
    onSelectList(null);
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    if (isMobile) {
      setIsCollapsed(true);
    }
  };

  const handleExitClick = async () => {
    await logout({
      logoutParams: { returnTo: `${window.location.origin}/signin` },
    });
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
      {!isMobile && (
        <HomeButton isCollapsed={isCollapsed} onClick={handleHomeClick} />
      )}
      {!isCollapsed ? (
        <ListManager
          lists={lists}
          selectedList={selectedList}
          onSelectList={onSelectList}
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
