/// <reference types="vite-plugin-svgr/client" />
import Logo from '../../assets/taskmaster-logo.svg?react';
import { useThemeStore } from '../../store/themeStore';
import { User } from '../../types/shared';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

import {
  HeaderContainer,
  LogoContainer,
  Title,
  UserActionsContainer,
  DarkModeIcon,
  VerticalDivider,
} from './Header.styled';

interface HeaderProps {
  user: User;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const activeTheme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo />
        <Title>TaskManager</Title>
      </LogoContainer>
      <UserActionsContainer>
        <DarkModeIcon
          icon={['far', activeTheme === 'light' ? 'moon' : 'sun']}
          size='lg'
          onClick={toggleTheme}
        />
        <VerticalDivider />
        <span>
          Hi, <b>{user.name}</b>
        </span>
        <FaIcon
          icon={[activeTheme === 'light' ? 'fas' : 'far', 'user-circle']}
          size='lg'
        />
      </UserActionsContainer>
    </HeaderContainer>
  );
};
