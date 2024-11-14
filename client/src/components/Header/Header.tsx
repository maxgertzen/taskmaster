import { useThemeStore } from '../../store/themeStore';
import { User } from '../../types/shared';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';
import { Logo } from '../Logo/Logo';

import {
  HeaderContainer,
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
      <Logo withTitle />
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
