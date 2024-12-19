import { FC } from 'react';

import { useAuth0 } from '@/mocks';

import { Title, Button } from '../../features/ui/components';
import { HomeLayout } from '../../layouts';

import { ActionButton } from './HomePage.styled';

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
    <HomeLayout>
      <Title variant='h1'>Welcome to TaskMaster</Title>
      <Title variant='h4'>Please continue to sign-in or sign-up</Title>
      <ActionButton>
        <Button onClick={handleLogin}>Continue</Button>
      </ActionButton>
    </HomeLayout>
  );
};
