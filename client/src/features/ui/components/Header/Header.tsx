import { Fragment, useRef } from 'react';

import { usePopupMenuState } from '@/shared/hooks';
import { useDashboardStore } from '@/shared/store/dashboardStore';
import { useViewportStore } from '@/shared/store/viewportStore';
import { UserDetails } from '@/shared/types/shared';
import { SelectedView } from '@/shared/types/ui';

import {
  Logo,
  LogoutButton,
  PopupMenu,
  SpriteIcon,
  SwitchThemeButton,
  Searchbar,
} from '..';

import {
  BackButtonWrapper,
  HeaderContainer,
  UserActionPanelViewContainer,
  UserActionsContainer,
  UserNameContainer,
  VerticalDivider,
} from './Header.styled';

interface HeaderProps {
  user: UserDetails | null;
  view?: SelectedView;
  setView?: (view: SelectedView) => void;
  onBack?: () => void | false;
}

const UserName: React.FC<HeaderProps> = ({ user }) => {
  return (
    <span>
      Hi
      {user?.name ? (
        <>
          , <b>{user.name}!</b>
        </>
      ) : (
        '!'
      )}
    </span>
  );
};

export const Header: React.FC<HeaderProps> = ({
  user,
  view,
  setView,
  onBack,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const { closeMenu, isOpen, toggleMenu } = usePopupMenuState();
  const selectedList = useDashboardStore((state) => state.selectedList);
  const setSelectedList = useDashboardStore((state) => state.setSelectedList);

  const isMobile = useViewportStore((state) => state.isMobile);

  return (
    <HeaderContainer>
      {!isMobile && <Logo withTitle />}
      {onBack && isMobile ? (
        <UserActionPanelViewContainer>
          <BackButtonWrapper
            role='button'
            aria-label='Back to lists'
            onClick={onBack}
          >
            <SpriteIcon name='arrowButton' size={4} />
            <label>Lists</label>
          </BackButtonWrapper>
          <Searchbar
            placeholder='Search tasks'
            selectedListId={selectedList?.id}
            onSearchCallback={() => {
              setSelectedList(null);
              setView?.('board');
            }}
          />
        </UserActionPanelViewContainer>
      ) : (
        <UserActionsContainer>
          <Searchbar
            placeholder='Search tasks'
            selectedListId={selectedList?.id}
            onSearchCallback={() => setSelectedList(null)}
          />
          {!isMobile && (
            <Fragment>
              <SwitchThemeButton />
              <VerticalDivider />
            </Fragment>
          )}

          <UserNameContainer>
            {view === 'board' && isMobile ? (
              <BackButtonWrapper
                role='button'
                aria-label='Back to lists'
                onClick={onBack}
              >
                <SpriteIcon name='arrowButton' size={4} />
                <label>Lists</label>
              </BackButtonWrapper>
            ) : (
              <Fragment>
                <UserName user={user} />
                <div
                  ref={triggerRef}
                  aria-haspopup='true'
                  aria-expanded={isOpen}
                  onClick={toggleMenu}
                >
                  <PopupMenu
                    options={[
                      { label: <SwitchThemeButton withText /> },
                      { label: <LogoutButton /> },
                    ]}
                    onClose={closeMenu}
                    isOpen={isOpen}
                    triggerRef={triggerRef}
                  />
                  <SpriteIcon name='user' size={4} />
                </div>
              </Fragment>
            )}
          </UserNameContainer>
        </UserActionsContainer>
      )}
    </HeaderContainer>
  );
};
