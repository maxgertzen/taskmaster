import { Fragment, useRef } from 'react';

import { usePopupMenuState } from '../../hooks/usePopupMenuState';
import { useTaskStore, useViewportStore } from '../../store/store';
import { User } from '../../types/shared';
import { Logo } from '../Logo/Logo';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import { PopupMenu } from '../PopupMenu/PopupMenu';
import { Searchbar } from '../Searchbar/Searchbar';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';
import { SwitchThemeButton } from '../SwitchThemeButton/SwitchThemeButton';

import {
  BackButtonWrapper,
  HeaderContainer,
  UserActionPanelViewContainer,
  UserActionsContainer,
  UserNameContainer,
  VerticalDivider,
} from './Header.styled';

interface HeaderProps {
  user: User;
  view?: 'sidebar' | 'taskPanel';
  setView?: (view: 'sidebar' | 'taskPanel') => void;
  onBack?: () => void;
}

const UserName: React.FC<HeaderProps> = ({ user: { name } }) => {
  return (
    <span>
      Hi
      {name ? (
        <>
          , <b>{name}!</b>
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
  const selectedListId = useTaskStore((state) => state.selectedListId);
  const setListId = useTaskStore((state) => state.setSelectedListId);

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
            selectedListId={selectedListId}
            onSearchCallback={() => {
              setListId(null);
              setView?.('taskPanel');
            }}
          />
        </UserActionPanelViewContainer>
      ) : (
        <UserActionsContainer>
          <Searchbar
            selectedListId={selectedListId}
            onSearchCallback={() => setListId(null)}
          />
          {!isMobile && (
            <Fragment>
              <SwitchThemeButton />
              <VerticalDivider />
            </Fragment>
          )}

          <UserNameContainer>
            {view === 'taskPanel' && isMobile ? (
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
