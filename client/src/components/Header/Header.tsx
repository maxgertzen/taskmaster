import { useTaskStore } from '../../store/store';
import { useThemeStore } from '../../store/themeStore';
import { User } from '../../types/shared';
import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';
import { Logo } from '../Logo/Logo';
import { TaskInput } from '../TaskInput/TaskInput';

import {
  HeaderContainer,
  UserActionsContainer,
  DarkModeIcon,
  VerticalDivider,
} from './Header.styled';

interface HeaderProps {
  user: User;
}

const UserName: React.FC<HeaderProps> = ({ user: { name } }) => {
  return (
    <span>
      Hi
      {name ? (
        <>
          , <b>{name}</b>
        </>
      ) : (
        '!'
      )}
    </span>
  );
};

export const Header: React.FC<HeaderProps> = ({ user }) => {
  const activeTheme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const selectedListId = useTaskStore((state) => state.selectedListId);
  const setListId = useTaskStore((state) => state.setSelectedListId);
  const searchTerm = useTaskStore((state) => state.searchTerm);
  const setSearchTerm = useTaskStore((state) => state.setSearchTerm);

  const handleSearch = (text: string) => {
    setListId(null);
    setSearchTerm(text);
  };

  const handleReset = () => {
    if (selectedListId) {
      setSearchTerm('');
    }
  };

  return (
    <HeaderContainer>
      <Logo withTitle />
      <UserActionsContainer>
        <TaskInput
          isSearch
          value={searchTerm}
          onReset={handleReset}
          onSubmit={handleSearch}
        />
        <DarkModeIcon
          icon={['far', activeTheme === 'light' ? 'moon' : 'sun']}
          size='lg'
          onClick={toggleTheme}
        />
        <VerticalDivider />
        <UserName user={user} />
        <FaIcon
          icon={[activeTheme === 'light' ? 'fas' : 'far', 'user-circle']}
          size='lg'
        />
      </UserActionsContainer>
    </HeaderContainer>
  );
};
