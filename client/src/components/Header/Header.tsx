import { useRef, useState } from 'react';

import { usePopupMenuState } from '../../hooks/usePopupMenuState';
import { useTaskStore } from '../../store/store';
import { useThemeStore } from '../../store/themeStore';
import { User } from '../../types/shared';
import { Logo } from '../Logo/Logo';
import { LogoutButton } from '../LogoutButton/LogoutButton';
import { PopupMenu } from '../PopupMenu/PopupMenu';
import { SpriteIcon } from '../SpriteIcon/SpriteIcon';
import { TaskInput } from '../TaskInput/TaskInput';

import {
  HamburgerMenu,
  HeaderContainer,
  UserActionsContainer,
  UserMenuContainer,
  UserNameContainer,
  VerticalDivider,
} from './Header.styled';

interface HeaderProps {
  user: User;
}

const UserName: React.FC<HeaderProps> = ({ user: { name } }) => {
  return (
    <UserNameContainer>
      Hi
      {name ? (
        <>
          , <b>{name}!</b>
        </>
      ) : (
        '!'
      )}
    </UserNameContainer>
  );
};

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const { closeMenu, isOpen, toggleMenu } = usePopupMenuState();
  const activeTheme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const selectedListId = useTaskStore((state) => state.selectedListId);
  const setListId = useTaskStore((state) => state.setSelectedListId);
  const searchTerm = useTaskStore((state) => state.searchTerm);
  const setSearchTerm = useTaskStore((state) => state.setSearchTerm);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (text: string) => {
    setListId(null);
    setSearchTerm(text);
  };

  const handleReset = () => {
    if (selectedListId) {
      setSearchTerm('');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <HeaderContainer>
      <Logo withTitle />
      <HamburgerMenu onClick={toggleMobileMenu}>
        <SpriteIcon name={isMobileMenuOpen ? 'x-button' : 'hamburger-menu'} />
      </HamburgerMenu>
      <UserActionsContainer isMobileOpen={isMobileMenuOpen}>
        <TaskInput
          isSearch
          value={searchTerm}
          onReset={handleReset}
          onSubmit={handleSearch}
        />
        <SpriteIcon
          name={activeTheme === 'light' ? 'moon' : 'sun'}
          onClick={toggleTheme}
        />
        <VerticalDivider />
        <UserName user={user} />
        <UserMenuContainer
          ref={triggerRef}
          aria-haspopup='true'
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <PopupMenu
            options={[{ label: <LogoutButton /> }]}
            onClose={closeMenu}
            isOpen={isOpen}
            triggerRef={triggerRef}
          />
          <SpriteIcon name='user' size={4} />
        </UserMenuContainer>
      </UserActionsContainer>
    </HeaderContainer>
  );
};
