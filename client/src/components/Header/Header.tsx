import { User } from '../../types/shared';

import {
  HeaderContainer,
  LogoContainer,
  Logo,
  Title,
  UserActionsContainer,
} from './Header.styled';

interface HeaderProps {
  user: User;
}

export const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <Logo src='/taskmaster-logo.svg' alt='Logo' />
        <Title>Task Manager</Title>
      </LogoContainer>
      <UserActionsContainer>
        Hi, <span>{user.name}</span>
      </UserActionsContainer>
    </HeaderContainer>
  );
};
