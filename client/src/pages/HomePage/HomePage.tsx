import { FC } from 'react';

import { Title, Button, Logo } from '../../components';
import { useAuth0 } from '../../mocks';

import { ContentContainer, HomePageContainer } from './HomePage.styled';

// TODO:
// - Implement a way to login
// - Implement a way to register
// - Implement a way to reset password
// - Implement a way to logout
export const HomePage: FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      appState: {
        returnTo: '/',
      },
    });
  };

  return (
    <HomePageContainer>
      <ContentContainer>
        <Logo />
        <Title variant='h1'>Welcome to TaskMaster</Title>
        <Title variant='h4'>Please continue to sign-in or sign-up</Title>
      </ContentContainer>
      <Button onClick={handleLogin}>Continue</Button>
    </HomePageContainer>
  );
};
