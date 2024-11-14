import { useAuth0 } from '@auth0/auth0-react';
import { FC } from 'react';

import { FaIcon } from '../FontAwesomeIcon/FontAwesomeIcon';

import { StyledLogoutButton } from './LogoutButton.styled';

export const LogoutButton: FC = () => {
  const { logout } = useAuth0();

  return (
    <StyledLogoutButton
      onClick={() =>
        logout({
          logoutParams: { returnTo: `${window.location.origin}/signin` },
        })
      }
    >
      <FaIcon icon='sign-out-alt' />
      Logout
    </StyledLogoutButton>
  );
};
