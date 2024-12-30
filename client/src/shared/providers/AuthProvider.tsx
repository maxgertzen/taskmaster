import { Auth0Provider } from '@auth0/auth0-react';
import React, { ReactNode } from 'react';

import {
  AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  IS_AUTH0_DISABLED,
} from '@/constants';
import { MockAuth0Provider } from '@/mocks';

const isMock = IS_AUTH0_DISABLED === 'true';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const Provider = isMock ? MockAuth0Provider : Auth0Provider;

  return (
    <Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: AUTH0_AUDIENCE,
      }}
    >
      {children}
    </Provider>
  );
};

export default AuthProvider;
